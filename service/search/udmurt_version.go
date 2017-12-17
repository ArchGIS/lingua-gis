package search

import (
	"bytes"
	"errors"
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
	versionPhoneticCypher = "MATCH (w:Version) " +
		"%s " +
		"RETURN {id: w.id, name1: w.name1, name2: w.name2, name3: w.name3, sense: w.sense}"
)

var versionPhoneticHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	result, err := searchForVersionPhonetic(
		r.URL.Query().Get("mode"),
		r.URL.Query().Get("name"),
	)

	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
})

func searchForVersionPhonetic(mode, filter string) ([]byte, error) {
	if filter == "" {
		return nil, errors.New("Empty parameters not allowed")
	}

	var query string
	if mode == "udmurt" {
		query = fmt.Sprintf(versionPhoneticCypher, "WHERE w.name1 =~ {filter} OR w.name2 =~ {filter} OR w.name3 =~ {filter} ")
	} else {
		query = fmt.Sprintf(versionPhoneticCypher, "WHERE w.sense =~ {filter} ")
	}

	resp, err := neo.Run(query, neo.Params{"filter": `"(?ui)^.*` + filter + `.*$"`})
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
