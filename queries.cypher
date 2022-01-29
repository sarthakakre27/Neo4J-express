//create
create (movie:Movie{title: 'The hateful Eight'}),
(quentin:Person{name: 'Quentin Tarentino'}),
(quentin)-[:DIRECTED]->(movie)
return movie, quentin;

create (zoe:Person{name:"Zoe Bell", born: 1978})
return zoe

match (zoe:Person{name:"Zoe Bell"}),
(quentin:Person{name: "Quentin Tarentino"}),
(movie:Movie{title:"The hateful Eight"})
create (quentin)-[:HAS_CONTACT]->(zoe),
(zoe)-[:ACTED_IN{earnings:1000000}]->(movie)
return quentin, zoe, movie;




//Read
match (tom:Person{name: "Tom Hanks"})
match (tom)-[:HAS_CONTACT]->(person:Person)
match (person)-[role:ACTED_IN]->(movie)
where person.born >= 1960 and role.earnings > 10000000
return person.name, person.born, role.earnings

match (tom:Person{name: "Tom Hanks"})
match (tom)-[:HAS_CONTACT]->(person:Person)
match (person)-[role:ACTED_IN]->(movie)
where person.born >= 1960 and role.earnings > 10000000
return person.name as ContactName, person.born as born, role.earnings
order by role.earnings desc;


//update
 
match (actor:Person)-[role:ACTED_IN]->(:Movie)
with actor, sum(role.earnings) as total_earnings
where total_earnings > 50000000
set actor:Rich, actor.total_earnings = total_earnings
return actor

match (actor:Person:Rich)-[:ACTED_IN]->(:Movie)
remove actor:Rich, actor.total_earnings
return actor








//Delete

match (tom:Person{name: "Tom Hanks"}),
(other)-[rel:HAS_CONTACT]->(tom)
delete rel;

match (movie:Movie{title: "The Da Vinci Code"}),
(node)-[rel]->(movie)
delete rel, movie

//Paths
match (matrixActor:Person)-[:ACTED_IN]->(matrix:Movie{title: "The Matrix"}),
(topGunActor:Person)-[:ACTED_IN]->(topGun:Movie{title: "Top Gun"}),
path = shortestPath((matrixActor)-[*..20]->(topGunActor))
return topGun, matrix, path
limit 3