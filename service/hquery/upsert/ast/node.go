package ast

import (
	"github.com/ArchGIS/lingua-gis/service/hquery/errs"
	"github.com/ArchGIS/lingua-gis/service/hquery/parsing"
	"github.com/ArchGIS/lingua-gis/throw"
)

func MustNewNode(tag string, rawProps map[string]string) *Node {
	throw.If(len(rawProps) == 0, errs.NodeNoProps)

	name, labels := parsing.MustDestructureNodeTag(tag)

	return &Node{tag, name, labels, mustNewProps(rawProps)}
}
