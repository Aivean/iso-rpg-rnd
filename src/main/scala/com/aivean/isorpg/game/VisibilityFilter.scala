package com.aivean.isorpg.game

import java.awt.Polygon
import java.awt.geom.Area

import scala.util.Try

/**
  *
  * @author <a href="mailto:ivan.zaytsev@webamg.com">Ivan Zaytsev</a>
  *         2015-12-12
  */
object VisibilityFilter {

  private case class Point2D(x: Float, y: Float) {
    def t = (x.toInt, y.toInt)
  }

  private def createPoly(ps: Seq[Point2D]) =
    new Polygon(ps.map(_.x.toInt).toArray, ps.map(_.y.toInt).toArray, ps.size)

  private def filter(point: Point, faces: Seq[Face], project: Point => Point2D) = {
    val area = new Area()
    faces.filter(_.faces(point)).sortBy(_.center.distTo(point)).filter {
      f =>
        Try {
          val p = createPoly(f.points.map(project))
          val pa = new Area(p)
          pa.subtract(area)

          if (!pa.isEmpty) {
            area.add(pa)
            true
          } else false
        }.getOrElse(true)
    }
  }

  def apply(point: Point, faces: Seq[Face]) = {

    def projectZ(cam: Point, f: Float)(p: Point) = {
      Point2D((p.x - cam.x) * (f / (p.z - cam.z)), (p.y - cam.y) * (f / (p.z - cam.z)))
    }

    def projectY(cam: Point, f: Float)(p: Point) = {
      Point2D((p.x - cam.x) * (f / (p.y - cam.y)), (p.z - cam.z) * (f / (p.y - cam.y)))
    }

    def projectX(cam: Point, f: Float)(p: Point) = {
      Point2D((p.y - cam.y) * (f / (p.x - cam.x)), (p.z - cam.z) * (f / (p.x - cam.x)))
    }

    class Classifier(axisc: Point => Int, c2: Point => Int, c3: Point => Int,
                          project0: (Point, Float) => Point => Point2D) {

      private def classNorm(p:Point, gap:Int) =
        axisc(p) >= 0 && Math.abs(c2(p)) - gap <= axisc(p) && Math.abs(c3(p)) - gap <= axisc(p)

      def classifyGap(p: Point) = classNorm(p.moved(-point.x, -point.y, -point.z), 4)

      def classify(p: Point) = classNorm(p.moved(-point.x, -point.y, -point.z), 0)

      def project(p:Point) =  project0(point, 10000)(p)
    }

    val classifiers = Seq(
      new Classifier(_.x, _.y, _.z, projectX),
      new Classifier(-_.x, _.y, _.z, projectX),
      new Classifier(_.y, _.x, _.z, projectY),
      new Classifier(-_.y, _.x, _.z, projectY),
      new Classifier(_.z, _.x, _.y, projectZ),
      new Classifier(-_.z, _.x, _.y, projectZ)
    )

    faces.filter(_.faces(point)).flatMap(f => classifiers.filter(_.classifyGap(f.p)).map(c => (c, f)))
      .groupBy(_._1).mapValues(_.map(_._2)).flatMap {
      case (cl, fs) =>
         filter(point, fs, cl.project).filter(f => cl.classify(f.p))

    }.toSeq.distinct
  }
}
