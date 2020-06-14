package mod.manager.entity.base

import io.github.yuemenglong.orm.lang.anno.{Column, ExportTS, Id}
import io.github.yuemenglong.orm.lang.types.Types._

class IEntity extends Serializable {
  @Id(auto = true)
  var id: Integer = _
}