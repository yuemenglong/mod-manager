package mod.manager.component

import java.io.FileOutputStream

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
  @Value("${db.host}") private val host = ""
  @Value("${db.port}") private val port = 0
  @Value("${db.username}") private val user = ""
  @Value("${db.password}") private val password = ""
  @Value("${db.name}") private val database = ""
  @Value("${db.min-conn}") private val minConn = 1
  @Value("${db.max-conn}") private val maxConn = 1
  @Value("${db.partition}") private val partition = 1

  var db: Db = _

  @PostConstruct
  def init(): Unit = {
    val list = Kit.scanPackage("mod.manager.entity")
    Orm.init(list)
    OrmTool.exportTsClass(new FileOutputStream("web/entity/entity.ts"))
    Orm.setLogger(true)
    JSON.setConstructorMap(OrmTool.getEmptyConstructorMap)
    db = Orm.open(new SqliteConfig(database).setPoolArgs(minConn, maxConn, partition))
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