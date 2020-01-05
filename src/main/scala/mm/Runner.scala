package mm

/**
  * Created by <yuemenglong@126.com> on 2020/1/5.
  */
object Runner {
  def main(args: Array[String]): Unit = {
    val parser = new ShellParser(args)
    parser.get("conf") match {
      case null =>
      case conf => ConfLoader.ins = new ConfLoader(conf)
    }
    ModManager.main(args)
  }
}
