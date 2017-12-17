// Package pfs is persistent file storage
package pfs

import (
	"github.com/ArchGIS/lingua-gis/service"
	"github.com/ArchGIS/lingua-gis/web"
)

// Config is map URL to handlers 
var Config = service.Config{
	StaticPath:  "local_storage",
	ServiceName: "pfs",
	Routes: []web.Route{
		{"/save", saveHandler},
		{"/load", loadHandler},
		{"/url", urlHandler},
	},
}
