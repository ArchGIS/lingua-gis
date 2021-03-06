// Calibrate radiocarbons
package calibrate

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"os/exec"
	"regexp"

	"github.com/ArchGIS/lingua-gis/ext"
	"github.com/ArchGIS/lingua-gis/service"
	"github.com/ArchGIS/lingua-gis/web"
	"github.com/ArchGIS/lingua-gis/web/api"
)

var Config = service.Config{
	ServiceName: "calibrate",
	Routes: []web.Route{
		{"/", calibrate},
	},
}

const (
	path = "/home/archgis/OxCal/bin/"
)

var calibrate = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	buff := new(bytes.Buffer)
	buff.ReadFrom(r.Body)
	reqBody := buff.Bytes()

	err := ioutil.WriteFile(path+"test.oxcal", reqBody, 0644)
	if err != nil {
		w.Write(append([]byte("First "), api.Error(err)...))
		return
	}

	command := exec.Command("./OxCalLinux", "test.oxcal")
	command.Dir = path
	command.Run()

	resFile, err := ioutil.ReadFile(path + "test.js")
	if err != nil {
		w.Write(append([]byte("Third "), api.Error(err)...))
		return
	}

	re := regexp.MustCompile(`ocd\[1\].likelihood.start=(-?\d*.?\d*)`)
	matched := re.Find(resFile)
	res := bytes.Split(matched, []byte("="))[1]

	var buf ext.Xbuf

	buf.WriteByte('{')
	buf.WriteString(`"start":`)
	buf.Write(res)
	buf.WriteByte(',')

	re = regexp.MustCompile(`ocd\[1\].likelihood.prob=(\[.*\])`)
	matched = re.Find(resFile)
	res = bytes.Split(matched, []byte("="))[1]

	buf.WriteString(`"prob":`)
	buf.Write(res)
	buf.WriteByte('}')

	w.Header().Set("Content-Type", "application/json")
	w.Write(buf.Bytes())
})
