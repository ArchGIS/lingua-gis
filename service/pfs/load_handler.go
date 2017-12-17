package pfs

import (
	"net/http"

	"github.com/ArchGIS/lingua-gis/echo"
	"github.com/ArchGIS/lingua-gis/service/pfs/errs"
	"github.com/ArchGIS/lingua-gis/web/api"
)

var loadHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	fileContents, err := agent.Load(r.FormValue("key"))

	if err != nil {
		echo.VendorError.Print(err)
		w.Write(api.Error(errs.LoadServerError))
	} else {
		w.Write(fileContents)
	}
})
