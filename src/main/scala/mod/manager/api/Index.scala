package mod.manager.api

import java.io.File
import java.nio.file.{Files, Path, Paths}
import java.text.SimpleDateFormat
import java.util.Date

import io.github.yuemenglong.json.JSON
import io.github.yuemenglong.orm.Orm
import io.github.yuemenglong.orm.tool.OrmTool
import javax.annotation.PostConstruct
import mod.manager.component.Dao
import mod.manager.entity.{Batch, BatchFile}
import mod.manager.util.{JsError, ParamError, SystemError}
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

  def deleteDir(file: File): Unit = {
    file.listFiles().foreach(f => {
      if (f.isDirectory) {
        deleteDir(f)
      } else {
        f.delete()
      }
    })
    file.delete()
  }

  @GetMapping(Array("/batch/list"))
  def getBatchList: String = dao.beginTransaction(session => {
    val root = Orm.root(classOf[Batch])
    root.selectArray(_.files)
    val ret = session.query(Orm.selectFrom(root))
    JSON.stringifyJs(ret)
  })

  @PostMapping(Array("/batch"))
  def postBatch(@RequestBody body: String): String = {
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

  @DeleteMapping(Array("/batch"))
  def deleteBatch(id: Integer): String = dao.beginTransaction(session => {
    val batch = OrmTool.selectByIdEx(classOf[Batch], id, session)(root => root.select(_.files))
    val ps = batch.files.map(_.path)
    val res = {
      val root = Orm.root(classOf[BatchFile])
      session.query(Orm.selectFrom(root).where(root.get(_.path).in(ps).and(root.get(_.id).gt(batch.files.last.id))))
    }
    if (res.length > 0) {
      throw ParamError("非最后安装版本,无法删除")
    }
    val ex = Orm.delete(batch)
    ex.deleteArray(_.files)
    session.execute(ex)

    val trashName = s"${getTimeStr}"
    batch.files.foreach(f => {
      val filePath = Paths.get(gameRoot, f.path)
      val trashPath = Paths.get(trashRoot, trashName, f.path)
      trashPath.toFile.getParentFile.mkdirs()
      try {
        Files.move(filePath, trashPath)
      } catch {
        case e: Throwable => println(s"${e}\nMove Trash: ${filePath} To ${trashPath} Fail")
          throw SystemError(e.toString)
      }
      if (f.act == "replace") {
        val backupPath = Paths.get(backupRoot, batch.backup, f.path)
        try {
          Files.move(backupPath, filePath)
        } catch {
          case e: Throwable => println(s"${e}\nMove Backup: ${backupPath} To ${filePath} Fail")
            throw SystemError(e.toString)
        }
      }
    })
    //    val backupRoot = Paths.get(backupDir, batch.backup)
    try {
      deleteDir(Paths.get(backupRoot, batch.backup).toFile)
    } catch {
      case e: Throwable => println(s"${e}\nDelete Backup: ${backupRoot} Fail")
        throw SystemError(e.toString)
    }
    "{}"
  })

  @GetMapping(Array("/open"))
  def openDir(name: String): String = {
    val root = name match {
      case "game" => gameRoot
      case "backup" => backupRoot
      case "trash" => trashRoot
    }
    Runtime.getRuntime.exec(s"cmd /c start explorer ${root}")
    "{}"
  }
}