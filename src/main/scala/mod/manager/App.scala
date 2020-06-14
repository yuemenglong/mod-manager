package mod.manager

import java.util.TimeZone

import io.github.yuemenglong.orm.lang.types.Types._
import javax.annotation.PostConstruct
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.web.bind.annotation._

object App {
  def main(args: Array[String]): Unit = {
    SpringApplication.run(classOf[App])
  }
}

@EnableAsync //作用是发现注解@Async的异步任务并执行
@CrossOrigin
@SpringBootApplication(scanBasePackages = Array("mod.manager"))
@RestController
class App {
  @PostConstruct def started(): Unit = {
//    TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
  }
}