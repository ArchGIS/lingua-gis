package cfg

import (
	"github.com/ArchGIS/lingua-gis/web/server"
)

func DevServer() server.Config {
	return server.Config{
		Port: "8181",
		Dns:  "localhost",
		Host: "localhost:8181",
	}
}
