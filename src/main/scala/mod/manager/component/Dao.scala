package mod.manager.component

import java.io.FileOutputStream
import java.nio.file.Paths

import javax.annotation.{PostConstruct, PreDestroy}
import io.github.yuemenglong.json.JSON
import io.github.yuemenglong.orm.Orm
import io.github.yuemenglong.orm.Session.Session
import io.github.yuemenglong.orm.db.{Db, MysqlConfig, SqliteConfig}
import io.github.yuemenglong.orm.tool.OrmTool
import mod.manager.util.Kit
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

/**
 * Created by <yuemenglong@126.com> on 2017/9/29.
 */
@Component
class Dao {
  @Value("${work.root}") private val workRoot = ""

  var db: Db = _

  @PostConstruct
  def init(): Unit = {
    val list = Kit.scanPackage("mod.manager.entity")
    Orm.init(list)
//    OrmTool.exportTsClass(new FileOutputStream("web/entity/entity.ts"))
    Orm.setLogger(true)
    JSON.setConstructorMap(OrmTool.getEmptyConstructorMap)
    db = Orm.open(new SqliteConfig(Paths.get(workRoot, "db.sqlite").toFile.getAbsolutePath).setPoolArgs(1, 1, 1))
    //    db = Orm.open(new MysqlConfig(host, port, user, password, database, minConn, maxConn, partition))
    db.check()
  }

  @PreDestroy
  def destroy(): Unit = {
    db.shutdown()
  }

  def beginTransaction[T](fn: Session => T): T = {
    db.beginTransaction(fn)
  }
}