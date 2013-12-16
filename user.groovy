def findNodeByName(name) {
  g.V("name", name)[0]
}


def findNodeById(id) {
  g.v(id)
}
