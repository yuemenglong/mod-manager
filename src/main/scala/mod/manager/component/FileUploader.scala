package mod.manager.component

import java.io.{File, FileOutputStream}
import java.nio.file.Paths

import io.github.yuemenglong.orm.Orm
import io.github.yuemenglong.orm.lang.types.Types.String
import mod.manager.entity.FileMeta
import mod.manager.util.Kit
import org.springframework.beans.factory.annotation.{Autowired, Value}
import org.springframework.stereotype.Component
import org.springframework.util.FileCopyUtils
import org.springframework.web.multipart.MultipartHttpServletRequest

import scala.collection.mutable.ArrayBuffer

@Component
class FileUploader {
  @Autowired
  var dao: Dao = _
  @Autowired
  var idGenerator: IdGenerator = _
  @Value("${static-dir}")
  var staticDir: String = _

  def upload(request: MultipartHttpServletRequest, root: String, tag: String): Array[FileMeta] = {
    val rootDir = Paths.get(staticDir, root).toFile
    if (!rootDir.exists()) {
      rootDir.mkdirs()
      //      throw SystemError("Upload Dir Not Exists, " + rootDir)
    }
    val iter = request.getFileNames
    val metas = new ArrayBuffer[FileMeta]()
    while (iter.hasNext) {
      val mpf = request.getFile(iter.next())
      val meta = new FileMeta
      meta.size = mpf.getSize
      meta.name = mpf.getOriginalFilename
      meta.root = root
      meta.ext = meta.name.split('.').last
      meta.path = s"${Kit.dateStr()}/${Kit.timeStr()}_${meta.id}.${meta.ext}"
      meta.tag = tag
      metas += meta
      val file = new File(s"${rootDir.getAbsolutePath}/${meta.path}")
      if (!file.getParentFile.exists()) {
        file.getParentFile.mkdir()
      }
      FileCopyUtils.copy(mpf.getBytes, new FileOutputStream(file))
    }
    val ret = Orm.convert(metas.toArray)
    dao.beginTransaction(session => {
      session.execute(Orm.inserts(ret))
    })
    ret
  }

}
