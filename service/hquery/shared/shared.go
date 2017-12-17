package shared

import (
	"github.com/ArchGIS/lingua-gis/cfg"
	"io"
	"net/http"
	"github.com/ArchGIS/lingua-gis/service/hquery/errs"
	"github.com/ArchGIS/lingua-gis/throw"
	"github.com/ArchGIS/lingua-gis/web/api"
)

func Handle(w http.ResponseWriter, r *http.Request, responder func(io.ReadCloser) []byte) {
	defer throw.Catch(func(err error) {
		if _, ok := err.(*errs.HqueryError); ok {
			w.Write([]byte(err.Error()))
		} else {
			// Runtime ошибка?
			panic(err)
		}
	})

	if r.ContentLength > cfg.HqueryUpsertMaxInputLen {
		w.Write(api.Error(errs.InputIsTooBig))
	}

	w.Write(responder(r.Body))
}
