import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, QueryControls } from '@wordpress/components';
import { RawHTML } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import './editor.scss';
import { format, dateI18n, getSettings } from '@wordpress/date';

export default function Edit( { attributes, setAttributes } ) {
	const { numberOfPosts, displayFeaturedImage, order, orderBy, categories } =
		attributes;

	const categoryIds =
		categories && categories.length
			? categories.map( ( category ) => category.id )
			: [];
	const posts = useSelect(
		( select ) => {
			return select( 'core' ).getEntityRecords( 'postType', 'post', {
				per_page: numberOfPosts,
				_embed: true,
				order,
				orderby: orderBy,
				categories: categoryIds,
			} );
		},
		[ numberOfPosts, order, orderBy, categories ]
	);

	const allCategories = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'taxonomy', 'category', {
			per_page: -1,
		} );
	}, [] );

	const onDisplayFeaturedImageChange = ( value ) => {
		setAttributes( {
			displayFeaturedImage: value,
		} );
	};

	const onNumberOfItemsChange = ( value ) => {
		setAttributes( {
			numberOfPosts: value,
		} );
	};

	const categorySuggestions = {};

	if ( allCategories ) {
		for ( const category of allCategories ) {
			categorySuggestions[ category.name ] = category;
		}
	}

	const onCategoryChange = ( values ) => {
		const hasNoSuggestions = values.some(
			( value ) =>
				typeof value === 'string' && ! categorySuggestions[ value ]
		);
		if ( hasNoSuggestions ) return;

		const updatedCategories = values.map( ( token ) => {
			return typeof token === 'string'
				? categorySuggestions[ token ]
				: token;
		} );

		setAttributes( { categories: updatedCategories } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<ToggleControl
						checked={ displayFeaturedImage }
						label={ __( 'Display Featured Image', 'latest-posts' ) }
						onChange={ onDisplayFeaturedImageChange }
					/>
					<QueryControls
						minItems={ 2 }
						maxItems={ 10 }
						numberOfItems={ numberOfPosts }
						onNumberOfItemsChange={ onNumberOfItemsChange }
						orderBy={ orderBy }
						onOrderByChange={ ( value ) =>
							setAttributes( { orderBy: value } )
						}
						order={ order }
						onOrderChange={ ( value ) =>
							setAttributes( { order: value } )
						}
						categorySuggestions={ categorySuggestions }
						selectedCategories={ categories }
						onCategoryChange={ onCategoryChange }
					/>
				</PanelBody>
			</InspectorControls>
			<ul { ...useBlockProps() }>
				{ posts &&
					posts.map( ( post ) => {
						const featuredImage =
							post._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ];
						return (
							<li key={ post.id }>
								{ displayFeaturedImage &&
									featuredImage !== undefined && (
										<img
											alt={ featuredImage.alt_text }
											src={
												featuredImage.media_details
													.sizes.large.source_url
											}
										/>
									) }
								<h5>
									<a href={ post.link }>
										{ post.title.rendered ? (
											<RawHTML>
												{ post.title.rendered }
											</RawHTML>
										) : (
											__( '(No title)', 'latest-posts' )
										) }
									</a>
								</h5>
								{ post.date_gmt && (
									<time
										dateTime={ format(
											'c',
											post.date_gmt
										) }
									>
										{ dateI18n(
											getSettings().formats.date,
											post.date_gmt
										) }
									</time>
								) }
								{ post.excerpt.rendered && (
									<RawHTML>{ post.excerpt.rendered }</RawHTML>
								) }
							</li>
						);
					} ) }
			</ul>
		</>
	);
}
