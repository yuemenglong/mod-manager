package mm

import java.io.{File, FileInputStream, FileOutputStream}
import java.util.Properties

object ConfLoader {
  var ins: ConfLoader = _

  def instance(): ConfLoader = {
    if (ins == null) {
      ins = new ConfLoader("conf.properties")
    }
    ins
  }
}

class ConfLoader(confName: String) {
  val properties = new Properties()
  if (new File(confName).exists()) {
    val is = new FileInputStream(confName)
    properties.load(is)
    is.close()
  } else {
    val os = new FileOutputStream(confName)
    os.close()
  }

  def loadConf(name: String, defaultValue: String): String = {
    if (!properties.stringPropertyNames().contains(name)) {
      saveConf(name, defaultValue)
    }
    properties.getProperty(name, defaultValue)
  }

  def saveConf(name: String, value: String): Unit = {
    properties.setProperty(name, value)
    sync()
  }

  def sync(): Unit = {
    val os = new FileOutputStream(confName)
    properties.store(os, "")
    os.close()
  }
}
