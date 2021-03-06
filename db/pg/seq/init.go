package seq

import (
	"github.com/ArchGIS/lingua-gis/cfg"
)

var idSequences map[string]string

func init() {
	idSequences = make(map[string]string, len(cfg.HqueryPermittedNodeLabels))

	for _, nodeLabel := range cfg.HqueryPermittedNodeLabels {
		idSequences[nodeLabel.Key] = nodeLabel.Seq
	}
}
