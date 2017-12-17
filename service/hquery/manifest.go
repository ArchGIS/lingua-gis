// Hyper Query
package hquery

import (
	"github.com/ArchGIS/lingua-gis/service"
	"github.com/ArchGIS/lingua-gis/service/hquery/read"
	"github.com/ArchGIS/lingua-gis/service/hquery/read2"
	"github.com/ArchGIS/lingua-gis/service/hquery/upsert"
	"github.com/ArchGIS/lingua-gis/service/hquery/delete"
	"github.com/ArchGIS/lingua-gis/web"
)

var Config = service.Config{
	ServiceName: "hquery",
	Routes: []web.Route{
		{"/upsert", upsert.Handler},
		{"/read", read.Handler},
		{"/read2", read2.Handler},
		{"/delete", delete.Handler},
	},
}
