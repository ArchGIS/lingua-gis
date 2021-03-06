package read

import (
	"io"
	"strings"

	"github.com/ArchGIS/lingua-gis/cfg"
	"github.com/ArchGIS/lingua-gis/service/hquery/errs"
	"github.com/ArchGIS/lingua-gis/service/hquery/parsing"
	"github.com/ArchGIS/lingua-gis/service/hquery/read/ast"
	"github.com/ArchGIS/lingua-gis/throw"
)

func MustNewParser(input io.ReadCloser) *Parser {
	this := &Parser{input: parsing.MustFetchJson(input)}

	for tag, _ := range this.input {
		throw.If(len(tag) > cfg.HqueryMaxTagLen, errs.TagTooLong)
	}

	this.nodes = make(map[string]*ast.Node, len(this.input))
	this.optionalNodes = make(map[string]*ast.Node, len(this.input))
	this.edges = make([]*ast.Edge, 0, len(this.input))
	this.optionalEdges = make([]*ast.Edge, 0, len(this.input))

	return this
}

func (my *Parser) mustParse() {
	for tag, query := range my.input {
		my.mustParseOne(tag, query)
	}

	for _, edge := range my.edges {
		if !(my.hasRef(edge.Lhs) && my.hasRef(edge.Rhs)) {
			throw.Error(errs.EdgeMissingRef)
		}
	}
}

func (my *Parser) mustParseOne(tag string, query map[string]string) {
	if strings.Contains(tag, "__") {
		if tag[0] == '?' {
			my.mustParseOptionalEdge(tag[1:], query)
		} else {
			my.mustParseEdge(tag, query)
		}
	} else {
		if tag[0] == '?' {
			my.mustParseOptionalNode(tag[1:], query)
		} else {
			my.mustParseNode(tag, query)
		}
	}
}

func (my *Parser) mustParseNode(tag string, query map[string]string) {
	node := ast.MustNewNode(tag, query)
	my.nodes[node.Name] = node
}

func (my *Parser) mustParseOptionalNode(tag string, query map[string]string) {
	node := ast.MustNewNode(tag, query)
	my.optionalNodes[node.Name] = node
}

func (my *Parser) mustParseEdge(tag string, query map[string]string) {
	my.edges = append(my.edges, ast.MustNewEdge(tag, query))
}

func (my *Parser) mustParseOptionalEdge(tag string, query map[string]string) {
	my.optionalEdges = append(my.optionalEdges, ast.MustNewEdge(tag, query))
}

func (my *Parser) hasRef(key string) bool {
	if _, ok := my.nodes[key]; ok {
		return true
	}
	if _, ok := my.optionalNodes[key]; ok {
		return true
	}

	return false
}
