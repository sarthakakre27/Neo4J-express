let neo4j = require('neo4j-driver');
let { creds } = require("./../config/credentials");
let driver = neo4j.driver("neo4j+s://c5e59cc8.databases.neo4j.io", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));

exports.get_num_nodes = async function () {
    let session = driver.session();
    const num_nodes = await session.run('MATCH (n:Person)-[:ACTED_IN]->(m:Movie) where n.name="Tom Hanks" RETURN n,m.title', {
    });
    session.close();
    console.log("RESULT", (!num_nodes ? 0 : num_nodes.records.length));
    return (!num_nodes ? 0 : num_nodes.records.length);
};
exports.create_user = async function (name) {
    let session = driver.session();
    let user = "No User Was Created";
    try {
        user = await session.run('MERGE (n:user {name: $id}) RETURN n', {
            id: name
        });
    }
    catch (err) {
        console.error(err);
        return user;
    }
    return user.records[0].get(0).properties.name;
}

exports.create_movie_director = async function (movie,director) {
    let session = driver.session();
    let user = null;
    try {
        result = await session.run(`create (movie:Movie{title: '${movie}'}),
        (director:Person{name: '${director}'}),
        (director)-[:DIRECTED]->(movie)
        return movie, director;`, {
        });
    }
    catch (err) {
        console.error(err);
        return result;
    }
    // console.log(result);
    console.log(result.records[0].get(0));
    return result.records[0].get(0).properties.name;
}

exports.sample_read_query = async function () {
    let session = driver.session();
    let user = null;
    try {
        result = await session.run(`match (tom:Person{name: "Tom Hanks"})
        match (tom)-[:HAS_CONTACT]->(person:Person)
        match (person)-[role:ACTED_IN]->(movie)
        where person.born >= 1960 and role.earnings > 10000000
        return person.name, person.born, role.earnings`, {
        });
    }
    catch (err) {
        console.error(err);
        return result;
    }
    // console.log(result);
    console.log(result);
    return result;
}

exports.sample_update_query = async function () {
    let session = driver.session();
    let user = null;
    try {
        result = await session.run(`match (actor:Person)-[role:ACTED_IN]->(:Movie)
        with actor, sum(role.earnings) as total_earnings
        where total_earnings > 50000000
        set actor:Rich, actor.total_earnings = total_earnings
        return actor`, {
        });
    }
    catch (err) {
        console.error(err);
        return result;
    }
    // console.log(result);
    console.log(result);
    return result;
}

exports.sample_delete_query = async function () {
    let session = driver.session();
    let user = null;
    try {
        result = await session.run(`match (tom:Person{name: "Tom Hanks"}),
        (other)-[rel:HAS_CONTACT]->(tom)
        delete rel;`, {
        });
    }
    catch (err) {
        console.error(err);
        return result;
    }
    // console.log(result);
    console.log(result);
    return result;
}