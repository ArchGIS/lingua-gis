package search

import (
	"bytes"
	"unsafe"
	"net/http"
	"unicode/utf8"

	"github.com/ArchGIS/lingua-gis/cfg"
	"github.com/ArchGIS/lingua-gis/db/neo"
	"github.com/ArchGIS/lingua-gis/echo"
	"github.com/ArchGIS/lingua-gis/ext"
	"github.com/ArchGIS/lingua-gis/service/search/errs"
	"github.com/ArchGIS/lingua-gis/web/api"
)

const (
	monumentsCypher = "MATCH (m:Monument)" +
		"MATCH (k:Knowledge)-[:belongsto]->(m)" +
		"MATCH (r:Research)-[:has]->(k)" +
		"MATCH (a:Author)<-[:hasauthor]-(r)" +
		"WHERE k.monument_name =~ {needle}" +
		"RETURN {" + 
		"monId: m.id, " +
		"monName: k.monument_name, " +
		"resYear: r.year, " +
		"autName: a.name}"
)

var monumentsHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	result, err := searchForMonuments(r.URL.Query().Get("needle"))

	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
})

func searchForMonuments(needle string) ([]byte, error) {
	if needle == "" {
		return nil, errs.FilterIsEmpty
	}

	runes := utf8.RuneCountInString(needle)
	if runes < cfg.SearchMinPrefixLen {
		return nil, errs.PrefixIsTooShort
	} else if runes > cfg.SearchMaxPrefixLen {
		return nil, errs.PrefixIsTooLong
	}

	// needle = norm.NormalMonument(needle)
	resp, err := neo.Run(monumentsCypher, neo.Params{"needle": `"(?ui)^.*` + needle + `.*$"`})
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
		buf.WriteByte('[')
		buf.Write(
			bytes.Join(*(*[][]byte)(unsafe.Pointer(&row.Row)), []byte(",")),
		)
		buf.WriteByte(']')
		buf.WriteByte(',')
	}
	buf.DropLastByte()
	buf.WriteByte(']')

	return buf.Bytes(), nil
}
