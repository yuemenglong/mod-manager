//package mm
//
//import java.io.File
//import java.nio.file.{Files, Paths}
//import java.text.SimpleDateFormat
//import java.util.Date
//
//import io.github.yuemenglong.orm.Orm
//import io.github.yuemenglong.orm.db.Db
//import io.github.yuemenglong.orm.lang.anno.{Entity, Id, OneToMany}
//import io.github.yuemenglong.orm.lang.types.Types._
//import javax.swing.table.DefaultTableModel
//
//import scala.collection.mutable.ArrayBuffer
//import scala.swing.Dialog.{Result, showConfirmation}
//import scala.swing.FileChooser.SelectionMode
//import scala.swing.event.{ButtonClicked, TableRowsSelected}
//import scala.swing.{FileChooser, _}
//
//@Entity
//class Batch {
//  @Id(auto = true)
//  var id: Integer = _
//  var name: String = _
//  var backup: String = _
//  var timestamp: String = _
//  @OneToMany
//  var files: Array[BatchFile] = Array()
//
//  def toRow: Array[Object] = Array(id, name, backup, timestamp)
//
//  def toModel: Array[Array[Object]] = files.map(f => Array[Object](f.id, f.path, f.act))
//}
//
//@Entity
//class BatchFile {
//  @Id(auto = true)
//  var id: Integer = _
//  var path: String = _
//  var act: String = _
//}
//
//object ModManager extends SimpleSwingApplication {
//
//  val loader: ConfLoader = ConfLoader.instance()
//  val storeDir: String = loader.loadConf("store-dir", getAbsolutePath("store"))
//  val backupDir: String = loader.loadConf("backup-dir", getAbsolutePath("backup"))
//  val trashDir: String = loader.loadConf("trash-dir", getAbsolutePath("trash"))
//  val dbPath: String = loader.loadConf("db-path", getAbsolutePath("db.sqlite"))
//  var lastChoose: String = loader.loadConf("last-choose", getAbsolutePath(""))
//
//  new File(storeDir).mkdirs()
//  new File(backupDir).mkdirs()
//  new File(trashDir).mkdirs()
//
//  Orm.init(Array(classOf[Batch], classOf[BatchFile]))
//  val db: Db = Orm.openSqliteDb(dbPath)
//  db.check()
//
//  val batchs: ArrayBuffer[Batch] = ArrayBuffer(db.beginTransaction(session => {
//    val root = Orm.root(classOf[Batch])
//    root.selectArray(_.files)
//    session.query(Orm.selectFrom(root))
//  }): _*).sortBy(_.id).reverse
//
//  def batchHeader: Array[Object] = Array[Object]("id", "name", "backup", "timestamp")
//
//  def fileHeader: Array[Object] = Array[Object]("id", "path", "act")
//
//  def batchModel: DefaultTableModel = new DefaultTableModel(batchs.map(_.toRow).toArray, batchHeader)
//
//  def fileModel: DefaultTableModel = {
//    val idx = batchView.selection.rows.leadIndex
//    if (0 <= idx && idx < batchs.length) {
//      new DefaultTableModel(batchs(idx).toModel, fileHeader)
//    } else {
//      new DefaultTableModel()
//    }
//  }
//
//  val addButton = new Button("Add")
//  val removeButton = new Button("Remove")
//  val viewButton = new Button("View")
//  val extractButton = new Button("Extract")
//  listenTo(addButton, removeButton, extractButton, viewButton)
//  reactions += {
//    case ButtonClicked(`addButton`) =>
//      add()
//    case ButtonClicked(`removeButton`) =>
//      remove()
//    case ButtonClicked(`extractButton`) =>
//      extract()
//    case ButtonClicked(`viewButton`) =>
//      view()
//  }
//
//  val output: TextArea = new TextArea(5, 40) {
//    editable = false
//  }
//  val fileView: Table = new Table
//  val batchView: Table = new Table
//  batchView.model = batchModel
//  listenTo(batchView.selection)
//  reactions += {
//    case TableRowsSelected(`batchView`, _, false) =>
//      fileView.model = fileModel
//  }
//
//  val mainPanel: BoxPanel = new BoxPanel(Orientation.Horizontal) {
//    contents += new BoxPanel(Orientation.Vertical) {
//      contents += new BoxPanel(Orientation.Horizontal) {
//        contents += addButton
//        contents += removeButton
//        contents += extractButton
//      }
//      contents += new ScrollPane(batchView)
//    }
//    contents += new BoxPanel(Orientation.Vertical) {
//      contents += viewButton
//      contents += new ScrollPane(fileView)
//      contents += new ScrollPane(output)
//    }
//  }
//
//  override def top: Frame = new MainFrame() {
//    title = "ModOrganizer"
//    contents = mainPanel
//  }
//
//  def refreshBatchView(): Unit = {
//    batchView.model = batchModel
//  }
//
//  def scanDir(file: File): Array[File] = {
//    file.listFiles().flatMap(f => f.isFile match {
//      case true => Array(f)
//      case false => scanDir(f)
//    })
//  }
//
//  def deleteDir(file: File): Unit = {
//    file.listFiles().foreach(f => {
//      if (f.isDirectory) {
//        deleteDir(f)
//      } else {
//        f.delete()
//      }
//    })
//    file.delete()
//  }
//
//  def getAbsolutePath(path: String): String = {
//    new File(path).getAbsolutePath
//  }
//
//  def getTimeStr: String = {
//    new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss").format(new Date())
//  }
//
//  def add(): Unit = {
//    output.text = ""
//    val fc = new FileChooser()
//    fc.fileSelectionMode = SelectionMode.DirectoriesOnly
//    fc.selectedFile = new File(lastChoose)
//    val res: FileChooser.Result.Value = fc.showOpenDialog(mainPanel)
//    if (res != FileChooser.Result.Approve) {
//      return
//    }
//    val selectRoot = fc.selectedFile.getAbsolutePath
//    val relBackup = s"${getTimeStr}_${fc.selectedFile.getName}"
//    val backupRoot = Paths.get(backupDir, relBackup).toString
//    new File(backupRoot).mkdir()
//    lastChoose = selectRoot
//    loader.saveConf("last-choose", lastChoose)
//
//    val batch = new Batch
//    batch.name = fc.selectedFile.getName
//    batch.backup = relBackup
//    batch.timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date())
//    batch.files = scanDir(fc.selectedFile).map(f => {
//      val bf = new BatchFile
//      val relPath = f.getAbsolutePath.replace(selectRoot, "")
//      val fStorePath = Paths.get(storeDir, relPath)
//      if (fStorePath.toFile.exists()) {
//        val fBackupPath = Paths.get(backupRoot, relPath)
//        fBackupPath.toFile.getParentFile.mkdirs()
//        Files.move(fStorePath, fBackupPath)
//        bf.act = "replace"
//      } else {
//        bf.act = "add"
//      }
//      bf.path = relPath
//      fStorePath.toFile.getParentFile.mkdirs()
//      Files.copy(f.toPath, fStorePath)
//      bf
//    })
//    val ex = Orm.insert(batch)
//    ex.insertArray(_.files)
//    db.beginTransaction(session => {
//      session.execute(ex)
//    })
//    batch.id = ex.root().id
//    batch.files.zip(ex.root().files).foreach { case (f1, f2) =>
//      f1.id = f2.id
//    }
//    batchs += batch
//    refreshBatchView()
//  }
//
//  def remove(): Unit = {
//    val idx = batchView.selection.rows.leadIndex
//    if (idx < 0 || idx >= batchs.length) {
//      return
//    }
//    showConfirmation(mainPanel,
//      "确认删除?",
//      "确认") match {
//      case Result.No => return
//      case Result.Yes =>
//    }
//    val batch = batchs(idx)
//    val ps = batch.files.map(_.path)
//    val res = db.beginTransaction(session => {
//      val root = Orm.root(classOf[BatchFile])
//      session.query(Orm.selectFrom(root).where(root.get(_.path).in(ps).and(root.get(_.id).gt(batch.files.last.id))))
//    })
//    if (res.length > 0) {
//      output.text = "非最后安装版本,无法删除"
//      return
//    }
//    output.text = ""
//    db.beginTransaction(session => {
//      val ex = Orm.delete(batch)
//      ex.deleteArray(_.files)
//      session.execute(ex)
//    })
//    val trashRoot = Paths.get(trashDir, s"${getTimeStr}_${batch.name}")
//    batch.files.foreach(f => {
//      val filePath = Paths.get(storeDir, f.path)
//      val trashPath = Paths.get(trashRoot.toString, f.path)
//      trashPath.toFile.getParentFile.mkdirs()
//      try {
//        Files.move(filePath, trashPath)
//      } catch {
//        case e: Throwable => output.text += s"${e}\nMove Trash: ${filePath} To ${trashPath} Fail\n"
//      }
//      if (f.act == "replace") {
//        val backupPath = Paths.get(backupDir, batch.backup, f.path)
//        try {
//          Files.move(backupPath, filePath)
//        } catch {
//          case e: Throwable => output.text += s"${e}\nMove Backup: ${backupPath} To ${filePath} Fail\n"
//        }
//      }
//    })
//    val backupRoot = Paths.get(backupDir, batch.backup)
//    try {
//      deleteDir(backupRoot.toFile)
//    } catch {
//      case e: Throwable => output.text += s"${e}\nDelete Backup: ${backupRoot} Fail\n"
//    }
//
//    batchs.remove(idx)
//    refreshBatchView()
//  }
//
//  def view(): Unit = {
//    val batch = {
//      val idx = batchView.selection.rows.leadIndex
//      if (idx < 0) {
//        return
//      }
//      batchs(idx)
//    }
//    val file = {
//      val idx = fileView.selection.rows.leadIndex
//      if (idx < 0) {
//        return
//      }
//      batch.files(idx)
//    }
//    val path = Paths.get(storeDir, file.path).toFile.getParent
//    output.text = path
//    Runtime.getRuntime.exec(s"cmd /c start explorer ${path}")
//  }
//
//  def extract(): Unit = {
//    new ExtractDialog(loader)
//  }
//}
//
//class ExtractDialog(loader: ConfLoader) extends Dialog {
//  var rootPathField = new TextField(loader.loadConf("extract-root", new File("").getAbsolutePath))
//  var targetPathField = new TextField(loader.loadConf("extract-target", new File("").getAbsolutePath))
//  val nameField = new TextField
//  val listPathField = new TextField
//  val dataPathField = new TextField
//
//  title = "Extract"
//  modal = true
//
//  contents = new BorderPanel {
//    preferredSize = new Dimension(800, 300)
//    layout(new BoxPanel(Orientation.Vertical) {
//      contents += new BorderPanel {
//        layout(new Label("rootPath")) = BorderPanel.Position.Center
//        layout(Button("Select") {
//          val fc = new FileChooser()
//          fc.selectedFile = new File(rootPathField.text)
//          fc.fileSelectionMode = SelectionMode.DirectoriesOnly
//          val res: FileChooser.Result.Value = fc.showOpenDialog(this)
//          if (res == FileChooser.Result.Approve) {
//            rootPathField.text = fc.selectedFile.getAbsolutePath
//            loader.saveConf("extract-root", rootPathField.text)
//          }
//        }) = BorderPanel.Position.East
//      }
//      contents += rootPathField
//      contents += new BorderPanel {
//        layout(new Label("targetPath")) = BorderPanel.Position.Center
//        layout(Button("Select") {
//          val fc = new FileChooser()
//          fc.selectedFile = new File(targetPathField.text)
//          fc.fileSelectionMode = SelectionMode.DirectoriesOnly
//          val res: FileChooser.Result.Value = fc.showOpenDialog(this)
//          if (res == FileChooser.Result.Approve) {
//            targetPathField.text = fc.selectedFile.getAbsolutePath
//            loader.saveConf("extract-target", targetPathField.text)
//          }
//        }) = BorderPanel.Position.East
//      }
//      contents += targetPathField
//      contents += new Label("Name")
//      contents += nameField
//      contents += new Label("ListPath")
//      contents += listPathField
//      contents += new Label("DataPath")
//      contents += dataPathField
//    }) = BorderPanel.Position.Center
//
//    layout(new BoxPanel(Orientation.Horizontal) {
//      contents += Button("Extract") {
//        if (extract()) {
//          close()
//        }
//      }
//      contents += Button("Cancel") {
//        close()
//      }
//    }) = BorderPanel.Position.South
//  }
//
//
//  private def cp(srcFile: File, destFile: File, preserveFileDate: Boolean = false): Unit = {
//    import java.io.{FileInputStream, FileOutputStream, IOException}
//    val FILE_COPY_BUFFER_SIZE = 1024 * 64
//    val fis = new FileInputStream(srcFile)
//    val fos = new FileOutputStream(destFile)
//    val input = fis.getChannel
//    val output = fos.getChannel
//    val size: Long = input.size
//    var pos: Long = 0L
//    var count = 0L
//    try while (pos < size) {
//      count = if (size - pos > FILE_COPY_BUFFER_SIZE)
//        FILE_COPY_BUFFER_SIZE
//      else
//        size - pos
//      pos += output.transferFrom(input, pos, count)
//    } finally {
//      output.close()
//      fos.close()
//      input.close()
//      fis.close()
//    }
//    if (srcFile.length != destFile.length) throw new IOException("Failed to copy full contents from '" + srcFile + "' to '" + destFile + "'")
//    if (preserveFileDate) destFile.setLastModified(srcFile.lastModified)
//  }
//
//  def extract(): Boolean = {
//    val rootDir = new File(rootPathField.text)
//    if (!rootDir.exists() || !rootDir.isDirectory) {
//      Dialog.showMessage(this, "Invalid Root", "Warn", Dialog.Message.Error)
//      return false
//    }
//    val targetDir = new File(targetPathField.text)
//    if (!targetDir.exists() || !targetDir.isDirectory) {
//      Dialog.showMessage(this, "Invalid Target", "Warn", Dialog.Message.Error)
//      return false
//    }
//    val listFile = Paths.get(rootDir.getAbsolutePath, "abdata/list/characustom", listPathField.text).toFile
//    if (!listFile.exists() || !listFile.isFile) {
//      Dialog.showMessage(this, "List File Not Exists", "Warn", Dialog.Message.Error)
//      return false
//    }
//    val dataFile = Paths.get(rootDir.getAbsolutePath, dataPathField.text).toFile
//    if (!dataFile.exists() || !dataFile.isFile) {
//      Dialog.showMessage(this, "Data File Not Exists", "Warn", Dialog.Message.Error)
//      return false
//    }
//    val dstDir = Paths.get(targetDir.getAbsolutePath, nameField.text).toFile
//    if (dstDir.exists()) {
//      Dialog.showMessage(this, "Name Already Exists", "Warn", Dialog.Message.Error)
//      return false
//    }
//    val listDst = Paths.get(dstDir.getAbsolutePath, "abdata/list/characustom", listPathField.text).toFile
//    listDst.getParentFile.mkdirs()
//    cp(listFile, listDst)
//
//    val dataDst = Paths.get(dstDir.getAbsolutePath, dataPathField.text).toFile
//    dataDst.getParentFile.mkdirs()
//    cp(dataFile, dataDst)
//    true
//  }
//
//  //  centerOnScreen()
//  open()
//}
