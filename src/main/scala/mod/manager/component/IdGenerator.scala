package mod.manager.component

import javax.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

import scala.util.Random

/**
 * Generates *unique* identifiers. There are *no* other requirements (e.g. randomness) as to the returned values.
 */


/**
 * Generates time-based unique ids. Each node should have a different `workerId`.
 *
 * *Synchronizes* to assure thread-safety!
 */
@Component
class IdGenerator() {
  @Value("${worker-id}")
  private val workerId: java.lang.Long = 1L

  private val inner = new IdGenerator_(workerId)

  def nextId(): Long = inner.nextId()

  @PostConstruct
  private def init(): Unit = {
    IdGenerator.ins = this
  }
}

private[component] class IdGenerator_(workerId: Long = 1, datacenterId: Long = 1) {

  private val idWorker = new IdWorker(workerId, datacenterId)

  def nextId(): Long = {
    synchronized {
      idWorker.nextId()
    }
  }

  def idBaseAt(timestamp: Long): Long = {
    idWorker.idForTimestamp(timestamp)
  }
}

/**
 * An object that generates IDs.
 * This is broken into a separate class in case
 * we ever want to support multiple worker threads
 * per process
 *
 * Copied from: https://github.com/twitter/snowflake/tree/master/src/main/scala/com/twitter/service/snowflake
 * Modified to fit our logging, removed stats.
 *
 * Single threaded!
 */
private class IdWorker(workerId: Long, datacenterId: Long, var sequence: Long = 0L) {
  val twepoch = 1288834974657L

  private val workerIdBits = 5L
  private val datacenterIdBits = 5L
  private val maxWorkerId = -1L ^ (-1L << workerIdBits)
  private val maxDatacenterId = -1L ^ (-1L << datacenterIdBits)
  private val sequenceBits = 12L

  private val workerIdShift = sequenceBits
  private val datacenterIdShift = sequenceBits + workerIdBits
  private val timestampLeftShift = sequenceBits + workerIdBits + datacenterIdBits
  private val sequenceMask = -1L ^ (-1L << sequenceBits)

  private var lastTimestamp = -1L

  // sanity check for workerId
  if (workerId > maxWorkerId || workerId < 0) {
    throw new IllegalArgumentException("worker Id can't be greater than %d or less than 0".format(maxWorkerId))
  }

  if (datacenterId > maxDatacenterId || datacenterId < 0) {
    throw new IllegalArgumentException("datacenter Id can't be greater than %d or less than 0".format(maxDatacenterId))
  }

  def get_worker_id(): Long = workerId

  def nextId(): Long = {
    var timestamp = timeGen()
    if (lastTimestamp == timestamp) {
      sequence = (sequence + 1) & sequenceMask
      if (sequence == 0) {
        timestamp = tilNextMillis(lastTimestamp)
      }
    } else {
      sequence = Math.abs(Random.nextLong()) % 10
    }

    if (timestamp < lastTimestamp) {
      throw new RuntimeException(
        "Invalid system clock: Clock moved backwards. Refusing to generate id for %d milliseconds".format(lastTimestamp - timestamp)
      )
    }

    lastTimestamp = timestamp
    ((timestamp - twepoch) << timestampLeftShift) |
      (datacenterId << datacenterIdShift) |
      (workerId << workerIdShift) |
      sequence
  }

  def idForTimestamp(timestamp: Long): Long = (timestamp - twepoch) << timestampLeftShift

  protected def tilNextMillis(lastTimestamp: Long): Long = {
    var timestamp = timeGen()
    while (timestamp <= lastTimestamp) {
      timestamp = timeGen()
    }
    timestamp
  }

  protected def timeGen(): Long = System.currentTimeMillis()
}

private object IdGenerator {

  private var ins: IdGenerator = _

  def nextId(): Long = ins.nextId()
}