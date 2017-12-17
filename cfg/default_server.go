package cfg

import (
	"github.com/ArchGIS/lingua-gis/web/server"
)

func DevServer() server.Config {
	return server.Config{
		Port: "5000",
		Dns:  "localhost",
		Host: "localhost:5000",
	}
}
