LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/e/2PACX-1vQCddAzW4iG5hsqebQjrJE2DzzWoq3rH6Juh10nUP-n2e0XKjb3tC_EVDe0ZmuHyFWlVqWyWHUXbKZx/pub?gid=1239192588&single=true&output=csv" AS line
CREATE (:Local {id: toInteger(line.ID), name: line.Name, x: toFloat(replace(line.X, ",", ".")), y: toFloat(replace(line.Y, ",", "."))});

CREATE (vc:VersionCounter {count: 1})
CREATE (wc:WordCounter {count: 1})
WITH vc, wc
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/e/2PACX-1vQCddAzW4iG5hsqebQjrJE2DzzWoq3rH6Juh10nUP-n2e0XKjb3tC_EVDe0ZmuHyFWlVqWyWHUXbKZx/pub?gid=1907372917&single=true&output=csv" AS line
MERGE (w:Word {name: line.`Термин`})
  ON CREATE SET w.id = wc.count, wc.count = wc.count + 1
CREATE (v:Version {id: vc.count, name1: line.Name1, sense: line.Sense})
SET vc.count = vc.count + 1
FOREACH (ignoreMe IN CASE WHEN line.Name2 IS NOT NULL THEN [1] ELSE [] END | SET v.name2 = line.Name2)
FOREACH (ignoreMe IN CASE WHEN line.Name3 IS NOT NULL THEN [1] ELSE [] END | SET v.name3 = line.Name3)
MERGE (w)-[:has]->(v)
WITH v, reduce(acc = [], x IN split(line.Local, ",") | acc + toInteger(trim(x))) as list
FOREACH (x in list |
  MERGE (l:Local {id: x})
    ON CREATE SET l.name = "Не определён"
  MERGE (v)-[:has]->(l)
);

MATCH (vc:VersionCounter), (wc:WordCounter) DELETE vc, wc;