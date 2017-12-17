package read

import (
	"github.com/ArchGIS/lingua-gis/ext"
	"github.com/ArchGIS/lingua-gis/service/hquery/parsing"
	"github.com/ArchGIS/lingua-gis/service/hquery/placeholder"
	"github.com/ArchGIS/lingua-gis/service/hquery/read/ast"
)

type Data struct {
	nodes         map[string]*ast.Node
	edges         []*ast.Edge
	optionalNodes map[string]*ast.Node
	optionalEdges []*ast.Edge
}

type Parser struct {
	input parsing.Tree
	limit string
	Data
}

type StatementBuilder struct {
	placeholder placeholder.Seq
	buf         ext.Xbuf
	params      map[string]string
	*Data
}
