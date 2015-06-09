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

var DATA_VERSION = 1;

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

var App = React.createClass({
	handleSearchHolder: function(route) {
		if (this.state.searchHolder !== route) {
			this.setState({
				searchHolder: route,
				searchValue: ''
			})
		}

	},
	handleSearch: function(e) {
		this.setState({
			searchValue: e.target.value.toLowerCase()
		})
	},
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
		var shouldDataUpdate = false;
		var storedDataVersion = parseInt(localStorage.getItem('dataVersion'));
		if (storedDataVersion !== DATA_VERSION) {
			localStorage.setItem('dataVersion', DATA_VERSION);
			shouldDataUpdate = true;
		}

		var mobile = false;
		if (!!('ontouchstart' in window))
			mobile = true;

		var bookmarks = {};
		var storedBookmarks = localStorage.getItem('bookmarks');
		if (storedBookmarks) 
			bookmarks = JSON.parse(storedBookmarks);

		return {
			shouldDataUpdate: shouldDataUpdate,
			searchValue: '',
			searchHolder: '',
			mobile: mobile,
			bookmarks: bookmarks
		};
	},
	render: function() {
		var output = null;
		if (true)
			output = <MobileLayout 
				handleSearch={this.handleSearch}
				toggleBookmarks={this.toggleBookmarks} 
				handleSearchHolder={this.handleSearchHolder}
				{...this.state}
			/>;
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
	sortBM: function (list) {
		return list.sort(function(a, b){
			var itemA = a.toLowerCase();
			var itemB = b.toLowerCase();
			if (itemA < itemB)
				return -1 
			if (itemA > itemB)
				return 1
			return 0
		});
	},
	groupBMMontersByCR: function(monsters) {
		monsters = this.sortBM(monsters);
		var monstersGrouped = [];
		for (i = 1; i <= 34; i++) {
			monstersGrouped.push([])
		}
		monsters.forEach(function(monster){
			monstersGrouped[MONSTERS_BY_KEY[monster].crNum].push(monster);
		})
		return monstersGrouped;
	},
	groupBMSpellsByLevel: function(spells) {
		spells = this.sortBM(spells);
		var spellsGrouped = [[],[],[],[],[],[],[],[],[],[]];
		spells.forEach(function(spell){
			spellsGrouped[SPELLS_BY_KEY[spell].level].push(spell);
		})
		return spellsGrouped;
	},
	componentWillMount: function() {
	    this.props.handleSearchHolder('bookmarks')  
	},
	render: function() {
		var BMSpellsByLevel = this.groupBMSpellsByLevel(this.props.bookmarks.spell);
		var spellGroups = [
			{
				groupTitleFc: groupTitleSpellsByLevel,
				group: BMSpellsByLevel
			}
		]
		var BMMontersByCR = this.groupBMMontersByCR(this.props.bookmarks.monster);
		var monsterGroups = [
			{
				groupTitleFc: groupTitleMontersByCR,
				group: BMMontersByCR
			}
		]
		return (
			<div>
				<MobileNav />
				<ListSearch {...this.props} />
				<List
					title='Spells'
					list='spellbook' 
					itemType='spell'
					groups={spellGroups}
					keys={SPELLS_BY_KEY}
					hideSubgroupLines={true}
					{...this.props}
				/>
				<List
					title='Monsters'
					list='bestiary'
					itemType='monster'
					groups={monsterGroups}
					keys={MONSTERS_BY_KEY}
					hideSubgroupLines={true}
					{...this.props}
				/>
			</div>
		)
	}
})

var Bestiary = React.createClass({
	componentWillMount: function () {
	    this.props.handleSearchHolder('bestiary')  
	},
	render: function() {
		var groups = [
			{
				groupTitleFc: groupTitleMontersByCR,
				group: MONSTERS_GROUPED_BY_CR
			}
		]
		return (
			<div>
				<MobileNav title='Bestiary'/>
				<ListSearch {...this.props} />
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
	getInitialState: function() {
		var dataSpells;
		var isReady = false;
		var storedDataSpells = localStorage.getItem('dataSpells');
		if (storedDataSpells) {
			dataSpells = JSON.parse(storedDataSpells);
			isReady = true;
		}
		return {
			dataSpells: dataSpells,
			isReady: isReady
		}
	},
	componentDidMount: function () {
		if (this.props.shouldDataUpdate === true || this.state.dataSpells === null) {
			$.get('/data/data-spells.json', function(result) {
				localStorage.setItem('dataSpells', JSON.stringify(result));
				this.setState({
					dataSpells: result,
					isReady: true
				});
			}.bind(this));
		}
	},
	componentWillMount: function () {
	    this.props.handleSearchHolder('spellbook')  
	},
	render: function() {
		var output;
		if (this.state.isReady) {
			var groups = [
				{
					groupTitleFc: groupTitleSpellsByLevel,
					group: this.state.dataSpells.SPELLS_GROUPED_BY_LEVEL
				}
			]
			output = <div>
				<ListSearch {...this.props} />
				<List
					list='spellbook' 
					itemType='spell'
					filters={this.state.dataSpells.SPELLS_CHAR_FILTERS}
					filterLists={this.state.dataSpells.SPELLS_CHAR_FILTER_LISTS}
					groups={groups}
					keys={this.state.dataSpells.SPELLS_BY_KEY}
					{...this.props}
				/>
			</div>
		} else {
			output = <div className='loader-wrapper'>Loading...</div>
		}
		return (
			<div>
				<MobileNav title='Spellbook'/>
				{output}
			</div>
		)
	}
})

var ListSearch = React.createClass({
	render: function() {
		return (
			<div className='list-search-wrapper'>
				<input className='list-search' onChange={this.props.handleSearch} value={this.props.searchValue} type='search' placeholder='Search'/>
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
			currentFilter: currentFilter,
			currentList: currentList,
			currentGroup: this.props.groups[0]
		};
	},
	render: function() {
		//Make filters
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
		
		//Prepare filtered group
		var groupsFiltered;

		if (this.props.filters)
			groupsFiltered = this.state.currentList;
		else
			groupsFiltered = this.state.currentGroup.group;

		if (this.props.searchValue !== '') {
			groupsFiltered = groupsFiltered.map(function(group){
				return group.filter(function(item){
					return item.toLowerCase().indexOf(this.props.searchValue) !== -1;
				}, this)
			}, this)
		} 

		//Make title
		var title;
		var showTitle = false;

		if (this.props.title)
			groupsFiltered.forEach(function(group){
				if (group.length > 0)
					showTitle = true;
			})

		if (this.props.title && showTitle)
			title = <div className='list-block-title'>{this.props.title}</div>

		return (
			<div>
				<div className='content-wrapper-mobile'>
					{filterSelect}
					<div className="list">
						{title}
						{this.state.currentGroup.group.map(function(group, i){
							var groupFiltered = groupsFiltered[i];

							var groupClass = 'list-group'
							if (groupFiltered.length === 0)
								groupClass = groupClass + ' hideme'

							var groupTitle = 'Empty!'
							if (group.length !== 0)
								groupTitle = this.state.currentGroup.groupTitleFc(this.props.keys[group[0]]);

							var groupTitleClass = 'list-group-title'
							if (this.props.hideSubgroupLines)
								groupTitleClass = 'list-group-title-noborder'

							return (
								<section className={groupClass} key={i}>
									<div className={groupTitleClass}>{groupTitle}</div>
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

		var ritual;
		if (this.props.ritual)
			ritual = <div className='list-item-icon'>R</div>;

		var concentration;
		if (this.props.concentration)
			concentration = <div className='list-item-icon'>C</div>;
		else if (this.props.ritual)
			concentration = <div className='list-item-icon'></div>;

		var bookmarksClass = 'list-item-icon';
		if (this.props.bookmarked === true)
			bookmarksClass = bookmarksClass + ' selected';
		return (
			<div className='list-item-content'>
				<div className={iconClass}></div>
				<div className='list-item-name'>{this.props.name}</div>
				{ritual}
				{concentration}
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
	<Route name='app' path='/' handler={App} >
		<Route name='spellbook' foo='bar' handler={Spellbook} />
		<Route name='spell' path='spellbook/:url' handler={SpellDescription} />
		<Route name='bestiary' handler={Bestiary} />
		<Route name='monster' path='bestiary/:url' handler={MonsterDescription} />
		<Route name='bookmarks' handler={Bookmarks} />
		<DefaultRoute handler={MobileMainMenu} />
	</Route>
);

Router.run(routes, function (Handler) {
	React.render(<Handler />, document.body);
});