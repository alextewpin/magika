var $ = require('jquery');
var React = require('react');
var Router = require('react-router');

var prepareSpells = require('./prepare-spells.js');
var makeSpellsCharFilterLists = require('./make-spells-char-filter-lists.js');
var makeSpellsCharFilters = require('./make-spells-char-filters.js');

var prepareMonsters = require('./prepare-monsters.js');

var Route = Router.Route;
var Link = Router.Link;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;

var SPELLS = []; // Общий список заклинаний (не используется напрямую)
var SPELLS_BY_KEY = {}; // Он же, но с ключами-именами
var SPELLS_GROUPED_BY_LEVEL = []; // Он же, сгруппированный по уровням (только имена)
var SPELLS_CHAR_FILTER_LISTS = {}; // Заклинания по классам (ключ - имя класса)
var SPELLS_CHAR_FILTERS = []; //Список классов

var MONSTERS = [];
var MONSTERS_BY_KEY = {};
var MONSTERS_GROUPED_BY_CR = [];

var groupSpellsByLevel = function(source) {
	var output = [[], [], [], [], [], [], [], [], [], []];
	source.forEach(function(spell){
		output[spell.level].push(spell.url);
	})
	return output;
}

var groupMontersByCR = function(source) {
	var output = [];
	for (i = 1; i <= 34; i++) {
		output.push([])
	}
	source.forEach(function(monster){
		output[monster.crNum].push(monster.url);
	})
	return output;
}

var groupTitleMontersByCR = function(monster) {
	return 'Challenge ' + monster.cr;
}

var groupTitleSpellsByLevel = function(spell) {
	if (spell.level === 0) 
		return 'Cantrips';
	else 
		return 'Level ' + spell.level;
}

var checkNotFoundItem = function(keys, item) {
	if (keys[item])
		return keys[item]
	else
		return {name: item}
}

var convertToObjects = function(source) {
	var output = {};
	source.forEach(function(item){
		output[item.url] = item;	
	})
	return output;
}

var App = React.createClass({
	toggleBookmarks: function(item, category, e) {
		e.preventDefault(); 
		var bookmarks = this.state.bookmarks;
		if (!bookmarks[category])
			bookmarks[category] = []

		var bmCategory = bookmarks[category];
		var index = bmCategory.indexOf(item);

		if (index === -1) {
			bmCategory.push(item);
			localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
			this.setState({
				bookmarks: bookmarks
			})
		}
		else {
			bmCategory.splice(index, 1);
			localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
			this.setState({
				bookmarks: bookmarks
			})
		}
	},
	getInitialState: function () {
		var mobile = false;
		if (!!('ontouchstart' in window))
			mobile = true;

		var bookmarks = {};
		var storedBookmarks = localStorage.getItem('bookmarks');
		if (storedBookmarks) 
			bookmarks = JSON.parse(storedBookmarks);

		return {
			  mobile: mobile,
			  bookmarks: bookmarks
		};
	},
	render: function() {
		var output = null;
		if (true)
			output = <MobileLayout toggleBookmarks={this.toggleBookmarks} {...this.state}/>;
		else
			output = <DesktopLayout />;
		return output;
	}
})

var DesktopLayout = React.createClass({
	render: function() {
		return <div>Desktop Layout</div>
	}
})

var MobileLayout = React.createClass({
	render: function() {
		return (
			<div className='wrapper-mobile'>
				<RouteHandler {...this.props}/>
				<div className='footer-mobile'>
					<Likely />
					<Author />
				</div>
			</div>
		)
	}
})

var MobileNav = React.createClass({
	render: function() {
		var back;
		if (this.props.backLink)
			back = <span>&nbsp;→ <Link to={this.props.backLink}>{this.props.backTitle}</Link></span>
		var title;
		if (this.props.title)
			back = <span>&nbsp;→ {this.props.title}</span>
		return (
			<div className='nav-mobile'>
				<div className='nav-breadcrumbs-mobile'>
					<div>
						<Link to='app' className='nav-logo-mobile'>Magika</Link>
						{title}
						{back}
					</div>
				</div>
				<Link to='bookmarks' className='nav-bookmarks-mobile'>Bookmarks</Link>
			</div>
		)
	}
})

var MobileMainMenu = React.createClass({
	render: function() {
		return (
			<div>
				<MobileNav />
				<div className='content-wrapper-mobile'>
					<div className='list'>
						<Link to='spellbook' className='list-item-menu-mobile'>Spellbook</Link>
						<Link to='bestiary' className='list-item-menu-mobile'>Bestiary</Link>
					</div>
				</div>
			</div>
		)
	}
})

var Likely = React.createClass({
	render: function() {
		return <div>Likely</div>
	}
})

var Author = React.createClass({
	render: function() {
		return <div>2015, Alex Tewpin</div>
	}
})

var Bookmarks = React.createClass({
	render: function() {
		return (
			<div>
				<MobileNav />
				<div className='content-wrapper-mobile'>
					<div>Bookmarks</div>
				</div>
			</div>
		)
	}
})

var Armory = React.createClass({
	render: function() {
		return (
			<div>
				<MobileNav />
				<div className='content-wrapper-mobile'>
					<div>Armory</div>
				</div>
			</div>
		)
	}
})

var Bestiary = React.createClass({
	render: function() {
		var groups = [
			{
				sortProp: 'crNum',
				groupTitleFc: groupTitleMontersByCR,
				optionTitle: 'Challenge',
				group: MONSTERS_GROUPED_BY_CR
			}
		]
		return (
			<div>
				<MobileNav title='Bestiary'/>
				<List 
					list='bestiary'
					itemType='monster'
					groups={groups}
					keys={MONSTERS_BY_KEY}
					{...this.props}
				/>
			</div>
		)
	}
})

var Spellbook = React.createClass({
	render: function() {
		var groups = [
			{
				sortProp: 'level',
				groupTitleFc: groupTitleSpellsByLevel,
				optionTitle: 'Level',
				group: SPELLS_GROUPED_BY_LEVEL
			}
		]
		var filters = SPELLS_CHAR_FILTERS;
		var filterLists = SPELLS_CHAR_FILTER_LISTS;
		return (
			<div>
				<MobileNav title='Spellbook'/>
				<List
					list='spellbook' 
					itemType='spell'
					filters={filters}
					filterLists={filterLists}
					groups={groups}
					keys={SPELLS_BY_KEY}
					{...this.props}
				/>
			</div>
		)
	}
})

var List = React.createClass({
	handleFilterSelect: function(e) {
		var filter = e.target.value;
		localStorage.setItem(this.props.list + 'Filter', JSON.stringify(filter));
		this.setState({
			currentFilter: filter,
			currentList: this.props.filterLists[filter]
		})
	},
	handleSortSelect: function(e) {

	},
	handleSearch: function(e) {
		this.setState({
			searchValue: e.target.value.toLowerCase()
		})
	},
	getInitialState: function () {
		var currentFilter = '';
		var currentList = [];

		if (this.props.filters) {
			var storedFilter = localStorage.getItem(this.props.list + 'Filter');
			if (storedFilter) 
				currentFilter = JSON.parse(storedFilter);
			else
				currentFilter = this.props.filters[0];
			currentList = this.props.filterLists[currentFilter];
		}

		return {
			searchValue: '',
			currentFilter: currentFilter,
			currentList: currentList,
			currentGroup: this.props.groups[0]
		};
	},
	render: function() {
		var filterOptions;
		var filterSelect;
		if (this.props.filters) {
			filterOptions = this.props.filters.map(function(filter){
				return <option key={filter} value={filter}>{filter}</option>
			});
		}
		if (filterOptions) {
			filterSelect = <InlineSelect
				handleSelect={this.handleFilterSelect}
				currentOption={this.state.currentFilter}
				options={filterOptions} />
		}
		return (
			<div>
				<div className='content-wrapper-mobile'>
					<div className='list-filters'>
						{filterSelect}
						<div><input className='list-filters-search' onChange={this.handleSearch} value={this.state.searchValue} type='search' placeholder='Search'/></div>
					</div>
					<div className="list">
						{this.state.currentGroup.group.map(function(group, i){
							var groupFiltered;

							if (this.props.filters)
								groupFiltered = this.state.currentList[i];
							else
								groupFiltered = group;
							 
							if (this.state.searchValue !== '') {
								groupFiltered = groupFiltered.filter(function(item){
									return item.toLowerCase().indexOf(this.state.searchValue) !== -1;
								}, this)
							} 

							var groupClass = 'list-group'
							if (groupFiltered.length === 0)
								groupClass = groupClass + ' hideme'

							var groupTitle = 'Empty!'
							if (group.length !== 0)
								groupTitle = this.state.currentGroup.groupTitleFc(this.props.keys[group[0]]);

							return (
								<section className={groupClass} key={i}>
									<div className="list-group-title">{groupTitle}</div>
									{group.map(function(itemUrl){
										var item = this.props.keys[itemUrl];

										var hidden = false;
										if (groupFiltered.indexOf(itemUrl) === -1)
											hidden = true;

										var bookmarked = false;
										if (this.props.bookmarks[this.props.itemType] && this.props.bookmarks[this.props.itemType].indexOf(itemUrl) !== -1)
											bookmarked = true;

										return (
											<ListItemWrapper hidden={hidden} bookmarked={bookmarked} key={itemUrl}>
												<ListItem 
													{...item}
													itemType={this.props.itemType}
													bookmarked={bookmarked}
													toggleBookmarks={this.props.toggleBookmarks} />
											</ListItemWrapper>
										)
									}, this)}
								</section>
							)
						}, this)}
					</div>
				</div>
			</div>
		)
	}
})

var ListItemWrapper = React.createClass({
	shouldComponentUpdate: function(nextProps) {
		return this.props.bookmarked !== nextProps.bookmarked || this.props.hidden !== nextProps.hidden;
	},
	render: function() {
		var wrapperClass = '';
		if (this.props.hidden === true)
			wrapperClass = 'hideme';
		return (
			<div className={wrapperClass}>
				{this.props.children}
			</div>
		)
	}
})

var ListItem = React.createClass({
	shouldComponentUpdate: function(nextProps) {
		return this.props.bookmarked !== nextProps.bookmarked;
	},
	render: function() {
		var bookmarksClass = 'list-item-bookmark mobile';
		if (this.props.bookmarked === true)
			bookmarksClass = bookmarksClass + ' selected';

		var item;
		switch (this.props.itemType) {
			case 'spell':
				item = <SpellItem {...this.props} />
				break;
			case 'monster':
				item = <MonsterItem {...this.props} />
				break;
			default:
				item = null;
		}

		return (
			<div className='list-item-wrapper'>
				<Link to={this.props.itemType} params={{url: this.props.url}} className='list-item-link'>{item}</Link>
				<div 
					className={bookmarksClass} 
					onClick={this.props.toggleBookmarks.bind(null, this.props.url, this.props.itemType)}
				>★</div>
			</div>
		)
	}
})

var MonsterItem = React.createClass({
	render: function() {
		return (
			<div className='list-item-content'>
				<div className='list-item-name'>{this.props.name}</div>
				<div className='list-item-monster-type'>{this.props.typeShort}</div>
			</div>
		)
	}
})

var SpellItem = React.createClass({
	render: function() {
		iconClass = 'icon icon-school-' + this.props.school;

		var concentration = '';
		if (this.props.concentration)
			concentration = 'C';

		var ritual = '';
		if (this.props.ritual)
			ritual = 'R';

		var bookmarksClass = 'list-item-icon';
		if (this.props.bookmarked === true)
			bookmarksClass = bookmarksClass + ' selected';
		return (
			<div className='list-item-content'>
				<div className={iconClass}></div>
				<div className='list-item-name'>{this.props.name}</div>
				<div className='list-item-icon'>{ritual}</div>
				<div className='list-item-icon'>{concentration}</div>
			</div>
		)
	}
})

var MonsterDescription = React.createClass({
	render: function() {
		monster = checkNotFoundItem(MONSTERS_BY_KEY, this.props.params.url);
		return (
			<div>
				<MobileNav backLink='bestiary' backTitle='Bestiary'/>
				<DescriptionWrapper>
					<DescriptionTitle title={monster.name} />
					<div className="description-subtitle">
						{monster.sizeFull + ' ' + monster.type + ', ' + monster.alignment}
					</div>
					<DescriptionSeparator />
					<div className='description-block'>
						<DescriptionItem title='Armor Class' value={monster.ac}/>
						<DescriptionItem title='Hit Points' value={monster.hp}/>
						<DescriptionItem title='Speed' value={monster.speed}/>
					</div>
					<DescriptionSeparator />
					<DescriptionBlockStats {...monster} />
					<DescriptionSeparator />
					<div className='description-block'>
						<DescriptionItem title='Saving Throws' value={monster.save}/>
						<DescriptionItem title='Damage Vulnerables' value={monster.vulnerable}/>
						<DescriptionItem title='Damage Resistances' value={monster.resist}/>
						<DescriptionItem title='Damage Immunities' value={monster.immune}/>
						<DescriptionItem title='Condition Immunities' value={monster.conditionImmune}/>
						<DescriptionItem title='Skills' value={monster.skill}/>
						<DescriptionItem title='Senses' value={monster.senses}/>
						<DescriptionItem title='Languages' value={monster.languages}/>
						<DescriptionItem title='Challenge' value={monster.cr}/>
					</div>
					<DescriptionSeparator />
					<DescriptionBlockProperties properties={monster.trait} />
					<DescriptionBlockProperties title='Actions' properties={monster.action} />
					<DescriptionBlockProperties title='Legengary Actions' properties={monster.legendary} />
				</DescriptionWrapper>
			</div>
		)
	}
})

var SpellDescription = React.createClass({
	render: function() {
		spell = checkNotFoundItem(SPELLS_BY_KEY, this.props.params.url);
		iconClass = 'icon icon-school-' + spell.school;
		return (
			<div>
				<MobileNav backLink='spellbook' backTitle='Spellbook'/>
				<DescriptionWrapper>
					<DescriptionTitle title={spell.name} />
					<div className="description-subtitle">
						<div className={iconClass}></div>
						<div>{spell.schoolAndLevel}</div>
					</div>
					<DescriptionSeparator />
					<div className="description-block">
						<DescriptionItem title='Casting Time' value={spell.time}/>
						<DescriptionItem title='Range' value={spell.range}/>
						<DescriptionItem title='Components' value={spell.components}/>
						<DescriptionItem title='Duration' value={spell.duration}/>
					</div>
					<DescriptionSeparator />
					<div className="description-block">
						<DescriptionText text={spell.text} hiLevelIndex={spell.hiLevelIndex} />
					</div>
				</DescriptionWrapper>
			</div>
		)
	}
})

var InlineSelect = React.createClass({
	render: function() {
		return (
			<div className='list-filters-select'>
				<div className='inline-select-wrapper'>
					<select className='inline-select' onChange={this.props.handleSelect} value={this.props.currentOption}>{this.props.options}</select>
					<div className='inline-select-holder-wrapper'><span className='inline-select-holder'>{this.props.currentOption} spells ▾</span></div>
				</div>
			</div>
		)
	}
})

var DescriptionWrapper = React.createClass({
	render: function() {
		return (
			<div className='content-wrapper-mobile'>
				<div className='description'>
					{this.props.children}
				</div>
			</div>
		)
	}
})

var DescriptionSeparator = React.createClass({
	render: function() {
		return <div className='description-separator'></div>;
	}
})

var DescriptionTitle = React.createClass({
	render: function() {
		return <div className='description-title'>{this.props.title}</div>;
	}
})

var DescriptionItem = React.createClass({
	render: function() {
		if (this.props.value)
			return <div className='description-item'><strong className='description-item-title'>{this.props.title} </strong>{this.props.value}</div>;
		else
			return null;
	}
})

var DescriptionBlockProperties = React.createClass({
	render: function() {
		var title = null;
		if (this.props.title)
			title = <div className='description-block-title'>{this.props.title}</div>
		if (this.props.properties) {
			return (
				<div className='description-block'>
					{title}
					{this.props.properties.map(function(property, i){
						return <DescriptionText key={i} text={property.text} title={property.name}/>
					}, this)}
				</div>
			)
		} else
			return null;
	}
})

var DescriptionText = React.createClass({
	render: function() {
		return (
			<div className='description-text'>
				{this.props.text.map(function(p, i){
					if (i === 0 && this.props.title)
						return <div key={i} className='description-p'><strong>{this.props.title}.</strong> {p}</div>;
					else if (this.props.hiLevelIndex && this.props.hiLevelIndex === i)
						return <div key={i} className='description-p'><strong>At Higher Levels:</strong> {p}</div>;
					else
						return <div key={i} className='description-p'>{p}</div>;
				}, this)}
			</div>
		)
	}
})

// Specific description blocks

var DescriptionBlockStats = React.createClass({
	render: function() {
		return (
			<div className='description-block'>
				<div className='description-stats-table'>
					<div className='description-stat-title'>STR</div>
					<div className='description-stat-title'>DEX</div>
					<div className='description-stat-title'>CON</div>
					<div className='description-stat-title'>INT</div>
					<div className='description-stat-title'>WIS</div>
					<div className='description-stat-title'>CHA</div>
				</div>
				<div className='description-stats-table'>
					<div>{this.props.strFull}</div>
					<div>{this.props.dexFull}</div>
					<div>{this.props.conFull}</div>
					<div>{this.props.intFull}</div>
					<div>{this.props.wisFull}</div>
					<div>{this.props.chaFull}</div>
				</div>
			</div>
		)
	}
})

var routes = (
	<Route name='app' path='/' handler={App}>
		<Route name='spellbook' handler={Spellbook} />
		<Route name='spell' path='spellbook/:url' handler={SpellDescription} />
		<Route name='bestiary' handler={Bestiary} />
		<Route name='monster' path='bestiary/:url' handler={MonsterDescription} />
		<Route name='bookmarks' handler={Bookmarks} />
		<DefaultRoute handler={MobileMainMenu} />
	</Route>
);

$.when(
	$.get('/data/data-spells-phb.json', function(reqData) {
		SPELLS = SPELLS.concat(reqData.spells.spell);
	}),
	$.get('/data/data-spells-ee.json', function(reqData) {
		SPELLS = SPELLS.concat(reqData.spells.spell);
	}),
	$.get('/data/data-monsters-mm.json', function(reqData) {
		MONSTERS = MONSTERS.concat(reqData.compendium.monster);
	})
).then(function() {
	SPELLS = prepareSpells(SPELLS);
	SPELLS_BY_KEY = convertToObjects(SPELLS);
	SPELLS_GROUPED_BY_LEVEL = groupSpellsByLevel(SPELLS);
	SPELLS_CHAR_FILTER_LISTS = makeSpellsCharFilterLists(SPELLS);
	SPELLS_CHAR_FILTERS = makeSpellsCharFilters(SPELLS_CHAR_FILTER_LISTS);

	MONSTERS = prepareMonsters(MONSTERS);
	MONSTERS_BY_KEY = convertToObjects(MONSTERS);
	MONSTERS_GROUPED_BY_CR = groupMontersByCR(MONSTERS);

	Router.run(routes, function (Handler) {
		React.render(<Handler />, document.body);
	});
});