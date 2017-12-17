package pfs

import (
	"net/http"

	"github.com/ArchGIS/lingua-gis/echo"
	"github.com/ArchGIS/lingua-gis/service/pfs/errs"
	"github.com/ArchGIS/lingua-gis/web/api"
)

var urlHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	key := r.URL.Query().Get("key")

	if "" == key {
		w.Write(api.Error(errs.UrlNoKey))
	} else {
		url, err := agent.Url(key)

		if err != nil {
			echo.VendorError.Print(err)
			w.Write(api.Error(errs.UrlNotFound))
		} else {
			w.Write([]byte(`{"url":"` + url + `"}`))
		}
	}
})
