package upsert

import (
	"github.com/ArchGIS/lingua-gis/service/hquery/parsing"
	"github.com/ArchGIS/lingua-gis/service/hquery/upsert/ast"
)

type Data struct {
	nodeInserts map[string]*ast.Node
	nodeUpdates map[string]*ast.Node
	edges       []*ast.Edge
}

type Parser struct {
	input parsing.Tree
	Data
}
