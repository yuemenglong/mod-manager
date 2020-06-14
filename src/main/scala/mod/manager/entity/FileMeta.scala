package mod.manager.entity

import io.github.yuemenglong.orm.lang.anno.{Column, Entity}
import io.github.yuemenglong.orm.lang.types.Types._
import mod.manager.entity.base.IEntity

@Entity
class FileMeta extends IEntity {
  var path: String = _
  @Column(length = 80)
  var name: String = _
  @Column(length = 40)
  var root: String = _
  @Column(length = 20)
  var ext: String = _
  var size: Long = _
  @Column(length = 20)
  var tag: String = _
}