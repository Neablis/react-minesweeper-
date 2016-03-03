var React = require('react');
var reactDom = require('react-dom');
var Minesweeper = require('../../../js/minesweeper/board');
Minesweeper.createBoard(10, 10, 5);
var time = null;

module.exports = React.createClass({
    getInitialState: function () {
        return {
            board: Minesweeper.getBoard(),
            timer: 0,
            bombsLeft: Minesweeper.getBombsLeft(),
            banner: '',
            bannerStyle: ''
        };
    },
    componentDidMount: function() {
        setInterval(this.tick, 1000); // Call a method on the mixin
    },
    tick: function() {
        time = this.setState({timer: this.state.timer + 1});
    },
    reset: function () {
        this.setState({timer: 0});
        Minesweeper.reset();
        Minesweeper.createBoard(10, 10, 5);

        this.setState({
            board: Minesweeper.getBoard(),
            timer: 0,
            bombsLeft: Minesweeper.getBombsLeft(),
            banner: '',
            bannerStyle: ''
        });

    },
    click: function (event) {
        event.preventDefault();
        if (event.target.textContent !== 'x') {
            return;
        }

        var target = event.target.getAttribute('data-index');
        target = target.split('-');
        var x = parseInt(target[0]);
        var y = parseInt(target[1]);

        if (Minesweeper.checkIfBomb(x,y)) {
            this.lose();
        } else {
            var cell = Minesweeper.getCell(x, y);
            Minesweeper.setCell(x, y, cell);

            if (cell === 0) {
                Minesweeper.reveal(x, y);
            }

            if (Minesweeper.checkWin()) {
                this.win();
            }
        }

        this.setState({board: Minesweeper.getBoard()});
    },
    lose: function () {
        Minesweeper.answer();

        this.setState({
            board: Minesweeper.getBoard(),
            banner: 'You lose!',
            bannerStyle: 'lost'
        });
    },
    win: function () {
        Minesweeper.answer();

        this.setState({
            board: Minesweeper.getBoard(),
            banner: 'You Win!',
            bannerStyle: 'won'
        });
    },
    mark: function (event) {
        event.preventDefault();
        var target = event.target.getAttribute('data-index');
        target = target.split('-');

        var targetVal = event.target.textContent;
        if (targetVal === '?') {
            Minesweeper.setCell(target[0], target[1], 'x');
            this.setState({board: Minesweeper.getBoard(), bombsLeft: this.state.bombsLeft+1});
            if (Minesweeper.checkWin()) {
                this.win();
            }
        } else {
            if (this.state.bombsLeft !== 0) {
                Minesweeper.setCell(target[0], target[1], '?');
                this.setState({board: Minesweeper.getBoard(), bombsLeft: this.state.bombsLeft-1});
            }
        }
    },
    render: function () {
        return (
            <div className='home'>
                <div className='centered container z-depth-5'>
                    <div className="row">
                        <div className="col s12">
                            <h1>Minesweeper</h1>
                        </div>
                        <div className="section col s4 offset-s4 banner">
                            <span className={this.state.bannerStyle}>{this.state.banner}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s3">Time: {this.state.timer}</div>
                        <div className="col s3">Bombs: {this.state.bombsLeft}</div>
                        <div className="col s6">
                            <a className="waves-effect waves-light btn" onClick={this.reset}>reset</a>
                        </div>
                    </div>
                    <table className="minesweeper centered table">
                        <tbody onClick={this.click} onContextMenu={this.mark}>
                            {this.state.board.map(function(row, i) {
                                return (
                                    <tr key={i}>
                                        {row.map(function(col, j) {
                                            var className = '';
                                            if (col === '!') {
                                                className = 'active';
                                            } else if (col === '?') {
                                                className = 'mark';
                                            } else if (col === 'B') {
                                                className = 'dead';
                                            } else if (col === 'x') {
                                                className = 'unclicked';
                                            }
                                            return (
                                                <td className={className} key={j} data-index={i+'-'+j}>{col}</td>
                                                );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});
