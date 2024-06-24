from .model_services import GenerateInsightsModel


model = GenerateInsightsModel()


def row_insights_for_metric(metric, api):
    loaded_model = model.load_model(metric)
    aggregated_data = model.aggregate_data(api)

    feature_importances = model.compute_feature_importances(loaded_model)
    
    last_week_insights = model.get_last_week_data(feature_importances, aggregated_data, metric)
    last_month_insights = model.get_last_month_data(feature_importances, aggregated_data)
    last_3months_insights = model.get_last_3months_data(feature_importances, aggregated_data)
    
    insights = {
        'last_week': last_week_insights,
        'last_month': last_month_insights,
        'last_3months': last_3months_insights
    }
    
    return insights