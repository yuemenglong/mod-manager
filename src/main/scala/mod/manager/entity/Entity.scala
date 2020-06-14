package mod.manager.entity

import io.github.yuemenglong.orm.lang.anno.{Entity, Id, OneToMany}
import io.github.yuemenglong.orm.lang.types.Types._

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

