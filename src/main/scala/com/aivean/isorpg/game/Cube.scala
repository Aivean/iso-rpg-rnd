package com.aivean.isorpg.game

/**
  *
  * @author <a href="mailto:ivan.zaytsev@webamg.com">Ivan Zaytsev</a>
  *         2015-12-12
  */
case class Cube(p: Point) {
  import Face._
  def faces = Seq(Face(p, X_-), Face(p, Y_-), Face(p, Z_-),
    Face(p.moved(x = 1), X_+),
    Face(p.moved(y = 1), Y_+),
    Face(p.moved(z = 1), Z_+)
  )
}