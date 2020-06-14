package mod.manager.api

import mod.manager.component.Dao
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation._

@CrossOrigin
@RestController
@RequestMapping(Array("/"))
class Index {

  @Autowired
  var dao: Dao = _

  //  @PostMapping(Array("/login"))
  //  def login(@RequestParam verifyCode: String, @RequestBody body: String): String = {
  //    val redisValue = RedisUtils.getStr(CacheKeys.VERIFY_CODE + verifyCode.trim.toUpperCase)
  //    if (StrUtils.isNull(redisValue) || !Constant.CONSTANT_STR_ONE.equals(redisValue)) {
  //      throw ParamError("验证码错误,请重新输入")
  //    }
  //    val user = JSON.parse(body, classOf[AuthUser])
  //    if (user.username == null || user.password == null) {
  //      throw AuthError("用户名或密码为空")
  //    }
  //    auth.login(user.username, user.password, "ADMIN")
  //    "{}"
  //  }
  //  @GetMapping(Array("/login"))
  //  def login(): String = {
  //    auth.login("admin", "123456", "ADMIN")
  //    "{}"
  //  }
  //
  //  @GetMapping(Array("/logout"))
  //  def logout(): String = {
  //    try {
  //      auth.logout()
  //    } catch {
  //      case e: Exception => e.printStackTrace()
  //    }
  //    "{}"
  //  }
  //
  //  @GetMapping(Array("/user"))
  //  def user(): String = {
  //    JSON.stringifyJs(Map("id" -> auth.currentUserId()))
  //  }
}