package mod.manager.api

import io.github.yuemenglong.json.JSON
import io.github.yuemenglong.orm.lang.types.Types._
import javax.servlet.http.{HttpServletRequest, HttpServletResponse}
import mod.manager.component.Dao
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation._

@CrossOrigin
@RestController
@RequestMapping(Array("/test"))
class Test {

  @Autowired
  var dao: Dao = _

  @GetMapping(Array(""))
  def test(request: HttpServletRequest, response: HttpServletResponse): String = {
    "{}"
  }

  @GetMapping(Array("/data"))
  def data(request: HttpServletRequest, response: HttpServletResponse): String = {
    val data: Int = request.getCookies match {
      case null => 0
      case cs => cs.find(_.getName == "ct").map(_.getValue).getOrElse("0").toInt
    }
    JSON.stringifyJs(Map("data" -> data))
  }
}