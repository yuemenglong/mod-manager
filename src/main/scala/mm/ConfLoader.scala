package mm

import java.io.{File, FileInputStream, FileOutputStream, InputStream}
import java.util.Properties

object ConfLoader {
  val CONF_NAME = "conf.properties"
  val properties = new Properties()
  if (new File(CONF_NAME).exists()) {
    val is = new FileInputStream(CONF_NAME)
    properties.load(is)
    is.close()
  } else {
    val os = new FileOutputStream(CONF_NAME)
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
    val os = new FileOutputStream(CONF_NAME)
    properties.store(os, "")
    os.close()
  }
}
