WITH "https://raw.githubusercontent.com/ArchGIS/lingua-gis/4886eae813161aff156df1e573bc9ae3603e5575/data_files/polygons.json" AS url
CALL apoc.load.json(url) YIELD value
UNWIND value.features as f
WITH reduce(acc = [], item IN f.geometry.coordinates[0] | acc + item[1] + item[0]) as coords, f.properties as pr
CREATE (a:Area {id: pr.OBJECTID, region: pr.name_adm1, district: pr.name_adm2, shape_length: pr.Shape_Length, shape_area: pr.Shape_Area, polygonCoords: coords})