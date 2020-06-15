package mod.manager.util

import java.io.{File, InputStream, OutputStream}
import java.util
import java.util.regex.Pattern

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.config.BeanDefinition
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider
import org.springframework.core.`type`.filter.RegexPatternTypeFilter
import org.springframework.util.DigestUtils
import java.awt.Desktop
import java.net.{URI, URL, URLEncoder}
import java.text.SimpleDateFormat
import java.util.Date

/**
  * Created by <yuemenglong@126.com> on 2017/11/21.
  */
object Kit {
  private val logger = LoggerFactory.getLogger("")

  def mkdir(path: String): Boolean = {
    val file = new File(path)
    file.mkdirs()
  }

  def mv(from: String, to: String): Boolean = {
    val f = new File(from)
    f.renameTo(new File(to))
  }

  def md5(s: String): String = {
    DigestUtils.md5DigestAsHex(s.getBytes)
  }

  def encode(s: String): String = {
    URLEncoder.encode(s, "UTF-8")
  }

  def openBrowser(url: String): Unit = {
    if (Desktop.isDesktopSupported) {
      val desktop = Desktop.getDesktop
      desktop.browse(new URI(url))
    }
    else {
      val runtime = Runtime.getRuntime
      runtime.exec("rundll32 url.dll,FileProtocolHandler " + url)
    }
  }

  def logError(e: Throwable) {
    e match {
      case _: JsError =>
      case _ => if (!e.isInstanceOf[JsError]) {
        e.getMessage + "\n" +
          logger.error(e.getStackTrace.map(ste => {
            ste.toString
          }).mkString("\n"))
        if (e.getCause != null) {
          logError(e.getCause)
        }
      }
    }
  }

  def pipe(is: InputStream, os: OutputStream): Unit = {
    val buffer = new Array[Byte](4096)
    Stream.continually({
      is.read(buffer)
    }).takeWhile {
      case -1 => false
      case 0 => true
      case n if n > 0 =>
        os.write(buffer, 0, n)
        true
    }.last
  }

  def scanPackage(path: String): Array[String] = {
    val provider: ClassPathScanningCandidateComponentProvider = new ClassPathScanningCandidateComponentProvider(false)
    provider.addIncludeFilter(new RegexPatternTypeFilter(Pattern.compile(".*")))
    val classes: util.Set[BeanDefinition] = provider.findCandidateComponents(path)
    val iter = classes.iterator()
    Stream.continually({
      if (iter.hasNext) {
        iter.next()
      } else {
        null
      }
    }).takeWhile(_ != null).map(_.getBeanClassName).toArray
  }

  def dateStr(): String = {
    val sdf = new SimpleDateFormat("yyyy_MM_dd")
    sdf.format(new Date())
  }

  def timeStr(): String = {
    val sdf = new SimpleDateFormat("yyyy_MM_dd_hh_mm_ss")
    sdf.format(new Date())
  }

  def getDate: java.sql.Date = {
    new java.sql.Date(new java.util.Date().getTime)
  }

  def getDateTime: java.sql.Timestamp = {
    new java.sql.Timestamp(new java.util.Date().getTime)
  }

}