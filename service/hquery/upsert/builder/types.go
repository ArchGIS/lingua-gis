package builder

import (
	"github.com/ArchGIS/lingua-gis/ext"
	"github.com/ArchGIS/lingua-gis/service/hquery/placeholder"
)

type StatementBuilder struct {
	placeholder placeholder.Seq
	buf         ext.Xbuf
	params      map[string]string
}
