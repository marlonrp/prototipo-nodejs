"use strict";

class Paginate {
  /**
   * @param {MangoosePaginate} res
   * @return {Paginate}
   */
  constructor(res) {
    (this.data = res.docs),
      (this.page = res.page),
      (this.totalPages = res.pagingCounter),
      (this.totalContent = res.totalDocs);

    return this;
  }
}

module.exports = Paginate;
