package mod.manager.util

import io.github.yuemenglong.json.JSON

object JsError {
  val AUTH_FAIL = "AUTH_ERROR"
  val INVALID_PARAM = "INVALID_PARAM_ERROR"
  val SYSTEM_ERROR = "SYSTEM_ERROR"
  val REDIS_ERROR = "REDIS_ERROR"
}

class JsError(val name: String, val message: String, val statusCode: Int) extends Exception(s"${name}: ${message}") {
  override def toString: String = {
    JSON.stringifyJs(Map(
      "name" -> name,
      "message" -> message
    ))
  }
}

case class AuthError(msg: String) extends JsError(JsError.AUTH_FAIL, msg, 403)

case class ParamError(msg: String) extends JsError(JsError.INVALID_PARAM, msg, 400)

case class SystemError(msg: String) extends JsError(JsError.SYSTEM_ERROR, msg, 500)

case class RedisError(msg: String) extends JsError(JsError.REDIS_ERROR, msg, 500)