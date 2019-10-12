package mm

import java.io.File
import java.nio.file.{Files, Paths}
import java.text.SimpleDateFormat
import java.util.Date

import io.github.yuemenglong.orm.Orm
import io.github.yuemenglong.orm.db.Db
import io.github.yuemenglong.orm.lang.anno.{Entity, Id, OneToMany}
import io.github.yuemenglong.orm.lang.types.Types._
import javax.swing.table.DefaultTableModel

import scala.collection.mutable.ArrayBuffer
import scala.swing.FileChooser.SelectionMode
import scala.swing.event.{ButtonClicked, TableRowsSelected}
import scala.swing.{FileChooser, _}

@Entity
class Batch {
  @Id(auto = true)
  var id: Integer = _
  var name: String = _
  var backup: String = _
  var timestamp: String = _
  @OneToMany
  var files: Array[BatchFile] = Array()

  def toRow: Array[Object] = Array(id, name, backup, timestamp)

  def toModel: Array[Array[Object]] = files.map(f => Array[Object](f.id, f.path, f.act))
}

@Entity
class BatchFile {
  @Id(auto = true)
  var id: Integer = _
  var path: String = _
  var act: String = _
}

object ModOrganizer extends SimpleSwingApplication {
  val storeDir: String = ConfLoader.loadConf("store-dir", getAbsolutePath("store"))
  val backupDir: String = ConfLoader.loadConf("backup-dir", getAbsolutePath("backup"))
  val trashDir: String = ConfLoader.loadConf("trash-dir", getAbsolutePath("trash"))
  val dbPath: String = ConfLoader.loadConf("db-path", getAbsolutePath("db.sqlite"))
  var lastChoose: String = ConfLoader.loadConf("last-choose", getAbsolutePath(""))

  new File(storeDir).mkdirs()
  new File(backupDir).mkdirs()
  new File(trashDir).mkdirs()

  Orm.init(Array(classOf[Batch], classOf[BatchFile]))
  val db: Db = Orm.openSqliteDb(dbPath)
  db.check()

  val batchs: ArrayBuffer[Batch] = ArrayBuffer(db.beginTransaction(session => {
    val root = Orm.root(classOf[Batch])
    root.selectArray(_.files)
    session.query(Orm.selectFrom(root))
  }): _*).sortBy(_.id).reverse

  def batchHeader: Array[Object] = Array[Object]("id", "name", "backup", "timestamp")

  def fileHeader: Array[Object] = Array[Object]("id", "path", "act")

  def batchModel: DefaultTableModel = new DefaultTableModel(batchs.map(_.toRow).toArray, batchHeader)

  def fileModel: DefaultTableModel = {
    val idx = batchView.selection.rows.leadIndex
    if (0 <= idx && idx < batchs.length) {
      new DefaultTableModel(batchs(idx).toModel, fileHeader)
    } else {
      new DefaultTableModel()
    }
  }

  val addButton = new Button("Add")
  val removeButton = new Button("Remove")
  val viewButton = new Button("View")
  listenTo(addButton, removeButton, viewButton)
  reactions += {
    case ButtonClicked(`addButton`) =>
      add()
    case ButtonClicked(`removeButton`) =>
      remove()
    case ButtonClicked(`viewButton`) =>
      view()
  }


  val output: TextArea = new TextArea(5, 40) {
    editable = false
  }
  val fileView: Table = new Table
  val batchView: Table = new Table
  batchView.model = batchModel
  listenTo(batchView.selection)
  reactions += {
    case TableRowsSelected(`batchView`, _, false) =>
      fileView.model = fileModel
  }

  val panel: BoxPanel = new BoxPanel(Orientation.Horizontal) {
    contents += new BoxPanel(Orientation.Vertical) {
      contents += new BoxPanel(Orientation.Horizontal) {
        contents += addButton
        contents += removeButton
      }
      contents += new ScrollPane(batchView)
    }
    contents += new BoxPanel(Orientation.Vertical) {
      contents += viewButton
      contents += new ScrollPane(fileView)
      contents += new ScrollPane(output)
    }
  }

  override def top: Frame = new MainFrame() {
    title = "ModOrganizer"
    contents = panel
  }

  def refreshBatchView(): Unit = {
    batchView.model = batchModel
  }

  def scan(file: File): Array[File] = {
    file.listFiles().flatMap(f => f.isFile match {
      case true => Array(f)
      case false => scan(f)
    })
  }

  def delete(file: File): Unit = {
    file.listFiles().foreach(f => {
      if (f.isDirectory) {
        delete(f)
      } else {
        f.delete()
      }
    })
    file.delete()
  }

  def getAbsolutePath(path: String): String = {
    new File(path).getAbsolutePath
  }

  def getTimeStr: String = {
    new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss").format(new Date())
  }

  def add(): Unit = {
    output.text = ""
    val fc = new FileChooser()
    fc.fileSelectionMode = SelectionMode.DirectoriesOnly
    fc.selectedFile = new File(lastChoose)
    val res: FileChooser.Result.Value = fc.showOpenDialog(panel)
    if (res != FileChooser.Result.Approve) {
      return
    }
    val selectRoot = fc.selectedFile.getAbsolutePath
    val relBackup = s"${getTimeStr}_${fc.selectedFile.getName}"
    val backupRoot = Paths.get(backupDir, relBackup).toString
    new File(backupRoot).mkdir()
    lastChoose = selectRoot
    ConfLoader.saveConf("last-choose", lastChoose)

    val batch = new Batch
    batch.name = fc.selectedFile.getName
    batch.backup = relBackup
    batch.timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date())
    batch.files = scan(fc.selectedFile).map(f => {
      val bf = new BatchFile
      val relPath = f.getAbsolutePath.replace(selectRoot, "")
      val fStorePath = Paths.get(storeDir, relPath)
      if (fStorePath.toFile.exists()) {
        val fBackupPath = Paths.get(backupRoot, relPath)
        fBackupPath.toFile.getParentFile.mkdirs()
        Files.move(fStorePath, fBackupPath)
        bf.act = "replace"
      } else {
        bf.act = "add"
      }
      bf.path = relPath
      fStorePath.toFile.getParentFile.mkdirs()
      Files.copy(f.toPath, fStorePath)
      bf
    })
    val ex = Orm.insert(batch)
    ex.insertArray(_.files)
    db.beginTransaction(session => {
      session.execute(ex)
    })
    batch.id = ex.root().id
    batch.files.zip(ex.root().files).foreach { case (f1, f2) =>
      f1.id = f2.id
    }
    batchs += batch
    refreshBatchView()
  }

  def remove(): Unit = {
    val idx = batchView.selection.rows.leadIndex
    if (idx < 0 || idx >= batchs.length) {
      return
    }
    val batch = batchs(idx)
    val ps = batch.files.map(_.path)
    val res = db.beginTransaction(session => {
      val root = Orm.root(classOf[BatchFile])
      session.query(Orm.selectFrom(root).where(root.get(_.path).in(ps).and(root.get(_.id).gt(batch.files.last.id))))
    })
    if (res.length > 0) {
      output.text = "非最后安装版本,无法删除"
      return
    }
    output.text = ""
    db.beginTransaction(session => {
      val ex = Orm.delete(batch)
      ex.deleteArray(_.files)
      session.execute(ex)
    })
    val trashRoot = Paths.get(trashDir, s"${getTimeStr}_${batch.name}")
    batch.files.foreach(f => {
      val filePath = Paths.get(storeDir, f.path)
      val trashPath = Paths.get(trashRoot.toString, f.path)
      trashPath.toFile.getParentFile.mkdirs()
      try {
        Files.move(filePath, trashPath)
      } catch {
        case e: Throwable => output.text += s"${e}\nMove Trash: ${filePath} To ${trashPath} Fail\n"
      }
      if (f.act == "replace") {
        val backupPath = Paths.get(backupDir, batch.backup, f.path)
        try {
          Files.move(backupPath, filePath)
        } catch {
          case e: Throwable => output.text += s"${e}\nMove Backup: ${backupPath} To ${filePath} Fail\n"
        }
      }
    })
    val backupRoot = Paths.get(backupDir, batch.backup)
    try {
      delete(backupRoot.toFile)
    } catch {
      case e: Throwable => output.text += s"${e}\nDelete Backup: ${backupRoot} Fail\n"
    }

    batchs.remove(idx)
    refreshBatchView()
  }


  def view(): Unit = {
    val batch = {
      val idx = batchView.selection.rows.leadIndex
      if (idx < 0) {
        return
      }
      batchs(idx)
    }
    val file = {
      val idx = fileView.selection.rows.leadIndex
      if (idx < 0) {
        return
      }
      batch.files(idx)
    }
    val path = Paths.get(storeDir, file.path).toFile.getParent
    output.text = path
    Runtime.getRuntime.exec(s"cmd /c start explorer ${path}")
  }
}