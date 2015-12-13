package com.aivean.isorpg.routes

import xitrum.Action

trait DefaultLayout extends Action {
  override def layout = renderViewNoLayout[DefaultLayout]()
}

trait WebGLLayout extends Action {
  override def layout = renderViewNoLayout[WebGLLayout]()
}