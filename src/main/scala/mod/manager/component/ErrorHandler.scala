package mod.manager.component

import javax.servlet.http.{HttpServletRequest, HttpServletResponse}
import mod.manager.util.{JsError, SystemError}
import org.springframework.web.bind.annotation.{ControllerAdvice, ExceptionHandler}

object ErrorHandler {
  def handle(request: HttpServletRequest, response: HttpServletResponse, ex: Exception): Unit = {
    println(s"[${request.getRequestURI}]: ${ex}")
    val jsErr = ex match {
      case err: JsError => err
      case err: Exception => SystemError(err.getMessage)
    }
    response.setStatus(jsErr.statusCode)
    response.setContentType("application/json")
    response.getOutputStream.write(jsErr.toString.getBytes())
    response.getOutputStream.close()
  }
}

@ControllerAdvice
class ErrorHandler {

  @ExceptionHandler(Array(classOf[Exception]))
  def handler(request: HttpServletRequest,
              response: HttpServletResponse,
              ex: Exception): Unit = {
    ErrorHandler.handle(request, response, ex)
  }
}