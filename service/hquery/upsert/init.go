package upsert

import (
	"github.com/ArchGIS/lingua-gis/cfg"
	"github.com/ArchGIS/lingua-gis/service/pfs/local"
	"github.com/ArchGIS/lingua-gis/storage"
)

var agent storage.FileStorage

func init() {
	switch cfg.PfsMain {
	case cfg.PfsLocal:
		agent = local.NewFileStorage("./fs/local_storage/")
	case cfg.PfsAmazonS3:
		panic("not implemented")

	default:
		panic("unknown PfsMain value")
	}
}
