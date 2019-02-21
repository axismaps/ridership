/**
 * Module for data probe--mouse hover data popup
 * @module dataProbe
 */

const privateProps = new WeakMap();

class DataProbe {
  constructor(config) {
    privateProps.set(this, {
      pos: null,
      probe: null,
      html: '',
      className: null,
      leader: false,
      container: null,
    });

    this.config(config);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  draw(onRemove = () => { console.log('close'); }) {
    const props = privateProps.get(this);
    const {
      pos,
      container,
      html,
      leader,
    } = props;

    const posStyle = Object.keys(pos)
      .reduce((accumulator, key) => {
        /* eslint-disable no-param-reassign */
        accumulator[key] = `${pos[key]}px`;
        /* eslint-enable no-param-reassign */
        return accumulator;
      }, {});

    const styles = Object.assign({
      position: 'absolute',
    }, posStyle);

    props.probe = container
      .append('div')
      .attr('class', 'data-probe')
      .styles(styles);

    props.probe
      .append('div')
      .attr('class', 'data-probe__inner')
      .html(html);

    props.probe
      .append('i')
      .attr('class', 'fas fa-times mobile')
      .on('click', () => {
        onRemove();
        this.remove();
      });

    if (leader) {
      props.probe
        .append('div')
        .attr('class', 'data-probe__down-leader-container')
        .append('div')
        .attr('class', 'data-probe__down-leader');
    }
  }

  remove() {
    const {
      probe,
    } = privateProps.get(this);
    if (probe === null || probe === undefined) return;

    probe.remove();
  }

  getContainer() {
    const {
      probe,
    } = privateProps.get(this);

    return probe;
  }

  getPos() {
    return privateProps.get(this).pos;
  }

  setPos(pos) {
    const {
      probe,
    } = privateProps.get(this);

    if (probe === null || probe === undefined) return this;

    const posStyle = Object.keys(pos)
      .reduce((accumulator, key) => {
        /* eslint-disable no-param-reassign */
        accumulator[key] = `${pos[key]}px`;
        /* eslint-enable no-param-reassign */
        return accumulator;
      }, {});

    probe
      .styles(posStyle);

    return this;
  }

  static clearProbes() {
    d3.selectAll('.data-probe').remove();
  }
}

export default DataProbe;
