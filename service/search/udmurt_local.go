package search

import (
	"bytes"
	"fmt"
	"net/http"
	"unsafe"

	"github.com/ArchGIS/lingua-gis/db/neo"
	"github.com/ArchGIS/lingua-gis/echo"
	"github.com/ArchGIS/lingua-gis/ext"
	"github.com/ArchGIS/lingua-gis/service/search/errs"
	"github.com/ArchGIS/lingua-gis/web/api"
)

const (
	localsCypher = "MATCH (w:Local) " +
		"%s " +
		"RETURN {id: w.id, name: w.name}"
)

var localsHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	result, err := searchForLocals(r.URL.Query().Get("name"))

	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
})

func searchForLocals(needle string) ([]byte, error) {
	var query string
	if needle == "" {
		query = fmt.Sprintf(localsCypher, "")
	} else {
		query = fmt.Sprintf(localsCypher, "WHERE w.name =~ {needle}")
	}

	resp, err := neo.Run(query, neo.Params{"needle": `"(?ui)^.*` + needle + `.*$"`})
	if err != nil {
		echo.ServerError.Print(err)
		return nil, errs.RetrieveError
	}

	if len(resp.Results[0].Data) == 0 {
		return []byte("[]"), nil
	}

	// Подготавливаем ответ.
	var buf ext.Xbuf

	buf.WriteByte('[')
	for _, row := range resp.Results[0].Data {
		// #FIXME: перепиши меня, когда будет время!
		buf.Write(
			bytes.Join(*(*[][]byte)(unsafe.Pointer(&row.Row)), []byte(",")),
		)
		buf.WriteByte(',')
	}
	buf.DropLastByte()
	buf.WriteByte(']')

	return buf.Bytes(), nil
}
