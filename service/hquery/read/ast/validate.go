package ast

import (
	"github.com/ArchGIS/lingua-gis/service/hquery/errs"
	"github.com/ArchGIS/lingua-gis/service/hquery/valid"
	"github.com/ArchGIS/lingua-gis/throw"
)

func mustValidateSelector(selector string) {
	if selector != "*" && selector != "" { // Единственный поддерживаемый на данный момент
		throw.Error(errs.QueryBadSelector)
	}
}

func mustValidateMatcher(matcher string) {
	if matcher == "" {
		throw.Error(errs.QueryNoMatcher)
	} else {
		if matcher != "*" && matcher != "?" && !valid.Number(matcher) {
			throw.Error(errs.QueryBadMatcher)
		}
	}
}
