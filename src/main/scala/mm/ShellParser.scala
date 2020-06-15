//package mm
//
///**
//  * Created by <yuemenglong@126.com> on 2020/1/5.
//  */
//class ShellParser(val args: Array[String]) {
//  def get(name: String): String = {
//    val p = args.indexOf(s"--$name")
//    if (p == -1) {
//      null
//    } else if (p == args.length - 1) {
//      ""
//    } else {
//      args(p + 1).startsWith("--") match {
//        case true => ""
//        case false => args(p + 1)
//      }
//    }
//  }
//}
