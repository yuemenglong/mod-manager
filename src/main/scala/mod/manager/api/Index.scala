package mod.manager.api

import java.io.File
import java.nio.file.{Files, Path, Paths}
import java.text.SimpleDateFormat
import java.util.Date

import io.github.yuemenglong.json.JSON
import io.github.yuemenglong.orm.Orm
import javax.annotation.PostConstruct
import mod.manager.component.Dao
import mod.manager.entity.{Batch, BatchFile}
import mod.manager.util.{JsError, ParamError}
import org.springframework.beans.factory.annotation.{Autowired, Value}
import org.springframework.web.bind.annotation._

@CrossOrigin
@RestController
@RequestMapping(Array("/"))
class Index {

  @Autowired
  var dao: Dao = _
  @Value("${mod.root}")
  var modRoot: String = _
  @Value("${game.root}")
  var gameRoot: String = _
  @Value("${work.root}")
  var workRoot: String = _

  def trashRoot: String = Paths.get(workRoot, "trasn").toAbsolutePath.toString

  def backupRoot: String = Paths.get(workRoot, "backup").toAbsolutePath.toString

  @PostConstruct
  def init(): Unit = {
    println(s"BackupRoot: [${backupRoot}]")
    println(s"TrashRoot: [${trashRoot}]")
    val trashRootFile = new File(trashRoot)
    if (!trashRootFile.exists()) {
      trashRootFile.mkdirs()
    }
    val backupRootFile = new File(backupRoot)
    if (!backupRootFile.exists()) {
      backupRootFile.mkdirs()
    }
  }

  def getTimeStr: String = {
    new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss").format(new Date())
  }

  def scanDir(file: File): Array[File] = {
    file.listFiles().flatMap(f => f.isFile match {
      case true => Array(f)
      case false => scanDir(f)
    })
  }

  @GetMapping(Array("/batch/list"))
  def getBatchList: String = dao.beginTransaction(session => {
    val root = Orm.root(classOf[Batch])
    root.selectArray(_.files)
    val ret = session.query(Orm.selectFrom(root))
    JSON.stringifyJs(ret)
  })

  @PostMapping(Array("/batch"))
  def PostBatch(@RequestBody body: String): String = {
    val uploadName = JSON.parse(body).asObj().getStr("root")
    val uploadDir = Paths.get(modRoot, uploadName).toFile
    if (!uploadDir.isDirectory) {
      throw ParamError("文件夹不存在")
    }
    val backupName = s"${getTimeStr}"

    val batch = new Batch
    batch.name = uploadName
    batch.backup = backupName
    batch.timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date())
    batch.files = scanDir(uploadDir).map(uploadFile => {
      val bf = new BatchFile
      val relPath = uploadFile.getAbsolutePath.replace(uploadDir.getAbsolutePath, "")
      val gameFilePath = Paths.get(gameRoot, relPath)
      if (gameFilePath.toFile.exists()) {
        val gameFileBackupPath = Paths.get(backupRoot, backupName, relPath)
        gameFileBackupPath.toFile.getParentFile.mkdirs()
        Files.move(gameFilePath, gameFileBackupPath)
        bf.act = "replace"
      } else {
        bf.act = "add"
      }
      bf.path = relPath
      gameFilePath.toFile.getParentFile.mkdirs()
      Files.copy(uploadFile.toPath, gameFilePath)
      bf
    })
    val ex = Orm.insert(batch)
    ex.insertArray(_.files)
    dao.beginTransaction(session => {
      session.execute(ex)
    })
    batch.id = ex.root().id
    batch.files.zip(ex.root().files).foreach { case (f1, f2) =>
      f1.id = f2.id
    }
    JSON.stringifyJs(batch)
  }

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